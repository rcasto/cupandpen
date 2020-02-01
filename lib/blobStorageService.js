const {
    BlobServiceClient,
    StorageSharedKeyCredential,
} = require('@azure/storage-blob');
const md = require('markdown-it')();
const mila = require('markdown-it-link-attributes');
const jsdom = require("jsdom");
const config = require('../config.json');
const memoryCache = new (require('./memoryCache'))(config.cache.expirationTimeInMs, config.cache.maxAmountOfEntries);

const { JSDOM } = jsdom;
const fileExtensionRegex = /\.[^/.]+$/;
const containerName = 'content';

md.use(mila, {
    attrs: {
        target: '_blank',
    }
});

function getBlobServiceClient() {
    const sharedKeyCredential = new StorageSharedKeyCredential(config.storageAccount.account, config.storageAccount.key);
    return new BlobServiceClient(
        `https://${config.storageAccount.account}.blob.core.windows.net`,
        sharedKeyCredential
    );
}

async function getContainerContents() {
    const blobServiceClient = getBlobServiceClient();
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get all content blobs
    const containerContentPromises = [];
    let blobDownloadPromise;

    for await (const blob of containerClient.listBlobsFlat()) {
        blobDownloadPromise = getBlobContent(blob, containerClient);
        containerContentPromises.push(blobDownloadPromise);
    }

    const containerContents = await Promise.all(containerContentPromises);
    const containerContentsMap = {};

    containerContents
        .sort((contentContent1, contentContent2) => {
            return contentContent2.timestamp - contentContent1.timestamp;
        })
        .forEach((containerContent, containerContentIndex) => {
            containerContentsMap[containerContent.name] = {
                prev: containerContentIndex - 1 < 0 ?
                    null : containerContents[containerContentIndex - 1],
                content: containerContent,
                next: containerContentIndex + 1 > containerContents.length - 1 ?
                    null : containerContents[containerContentIndex + 1],
            };
        });

    memoryCache.add('/', containerContentsMap);

    return containerContentsMap;
}

function getBlobContent(blob, containerClient) {
    const blobClient = containerClient.getBlobClient(blob.name);
    return blobClient.download(0)
            .then(async downloadBlobResponse => {
                const downloadBlobBody = await streamToString(downloadBlobResponse.readableStreamBody);
                const renderedContent = md.render(downloadBlobBody);
                return {
                    name: blob.name
                        .replace(fileExtensionRegex, ""),
                    data: renderedContent,
                    text: JSDOM.fragment(renderedContent).textContent || '',
                    timestamp: blob.properties.createdOn,
                };
            });
}

async function getAllContent() {
    const containerContentsMap = memoryCache.get('/') || await getContainerContents();
    return Object.values(containerContentsMap);
}

async function getContent(name) {
    const containerContentsMap = memoryCache.get('/') || await getContainerContents();
    return containerContentsMap[name];
}

// A helper method used to read a Node.js readable stream into string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", data => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

module.exports = {
    getAllContent,
    getContent
};