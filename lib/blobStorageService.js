const {
    BlobServiceClient,
    StorageSharedKeyCredential,
} = require('@azure/storage-blob');
const md = require('markdown-it')();
const config = require('../config.json');

const fileExtensionRegex = /\.[^/.]+$/;
const containerName = 'content';

async function getContainerContents() {
    const sharedKeyCredential = new StorageSharedKeyCredential(config.storageAccount.account, config.storageAccount.key);

    const blobServiceClient = new BlobServiceClient(
        `https://${config.storageAccount.account}.blob.core.windows.net`,
        sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get all content blobs
    let containerContentPromises = [];
    let blobClient, blobDownloadPromise;

    for await (const blob of containerClient.listBlobsFlat()) {
        console.log(JSON.stringify(blob));

        blobClient = containerClient.getBlobClient(blob.name);
        blobDownloadPromise = blobClient.download(0)
            .then(async downloadBlobResponse => {
                const downloadBlobBody = await streamToString(downloadBlobResponse.readableStreamBody);
                return {
                    name: blob.name
                        .replace(fileExtensionRegex, ""),
                    data: md.render(downloadBlobBody),
                    timestamp: blob.properties.createdOn,
                };
            });
        containerContentPromises.push(blobDownloadPromise);
    }

    const containerContents = await Promise.all(containerContentPromises);
    const containerContentsMap = {};

    containerContents
        .forEach(containerContent => {
            containerContentsMap[containerContent.name] = containerContent;
        });

    return containerContentsMap;
}

async function getAllContent() {
    const containerContentsMap = await getContainerContents();
    return Object.values(containerContentsMap);
}

async function getContent(name) {
    const containerContentsMap = await getContainerContents();
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