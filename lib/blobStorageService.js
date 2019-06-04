const {
    Aborter,
    BlobURL,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
} = require('@azure/storage-blob');

async function main() {
    const account = "cupandpen";
    const accountKey = "MFgRtBFNvfMl8tYN089zBbfIxMbg7AppTCmGx8GxEpG8T/3JI3WqTaMjPv3gA37sPPP1KNTu0l6OlJKwh4Zj+g==";

    // Use SharedKeyCredential with storage account and account key
    const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

    // Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(sharedKeyCredential);
    const serviceURL = new ServiceURL(
        `https://${account}.blob.core.windows.net`,
        pipeline
    );

    // Create a container
    const containerName = `content`;
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

    // List blobs
    let marker = undefined;
    let downloadPromises = [];
    do {
        const listBlobsResponse = await containerURL.listBlobFlatSegment(
            Aborter.none,
            marker
        );

        marker = listBlobsResponse.nextMarker;

        for (const blob of listBlobsResponse.segment.blobItems) {
            const blobURL = BlobURL.fromContainerURL(containerURL, blob.name);
            const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
            downloadPromises.push(streamToString(downloadBlockBlobResponse.readableStreamBody));
        }
    } while (marker);

    let downloadContents = await Promise.all(downloadPromises);
    downloadContents
        .forEach(downloadContent => console.log(downloadContent));
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

main()
    .then(() => {
        console.log("Successfully executed sample.");
    })
    .catch(err => {
        console.log(err.message);
    });

module.exports = {
    main,
};