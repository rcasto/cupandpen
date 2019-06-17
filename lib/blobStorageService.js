const {
    Aborter,
    BlobURL,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
} = require('@azure/storage-blob');
const md = require('markdown-it')();
const config = require('./config.json');

const fileExtensionRegex = /\.[^/.]+$/;

async function getContainerContents() {
    // Use SharedKeyCredential with storage account and account key
    const sharedKeyCredential = new SharedKeyCredential(config.storageAccount.account, config.storageAccount.key);

    // Use sharedKeyCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(sharedKeyCredential);
    const serviceURL = new ServiceURL(
        `https://${account}.blob.core.windows.net`,
        pipeline
    );
    const containerURL = ContainerURL.fromServiceURL(serviceURL, config.storageAccount.container);

    // Get all content blobs
    let marker;
    let containerContentPromises = [];

    do {
        const listBlobsResponse = await containerURL.listBlobFlatSegment(
            Aborter.none,
            marker
        );

        marker = listBlobsResponse.nextMarker;
        containerContentPromises = containerContentPromises.concat((listBlobsResponse.segment.blobItems || [])
            .map(async blob => {
                const blobURL = BlobURL.fromContainerURL(containerURL, blob.name);
                const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
                return {
                    name: blob.name
                        .replace(fileExtensionRegex, ""),
                    data: md.render(((await streamToString(downloadBlockBlobResponse.readableStreamBody))))
                };
            }));
    } while (marker);

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