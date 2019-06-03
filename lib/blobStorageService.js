const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
} = require('@azure/storage-blob');

async function main() {
    // Enter your storage account name and shared key
    const account = "cupandpen";
    const accountKey = "MFgRtBFNvfMl8tYN089zBbfIxMbg7AppTCmGx8GxEpG8T/3JI3WqTaMjPv3gA37sPPP1KNTu0l6OlJKwh4Zj+g==";

    // Use SharedKeyCredential with storage account and account key
    const sharedKeyCredential = new SharedKeyCredential(account, accountKey);

    // Use sharedKeyCredential, tokenCredential or anonymousCredential to create a pipeline
    const pipeline = StorageURL.newPipeline(sharedKeyCredential);
    const serviceURL = new ServiceURL(
        // When using AnonymousCredential, following url should include a valid SAS or support public access
        `https://${account}.blob.core.windows.net`,
        pipeline
    );

    // Create a container
    const containerName = `content`;
    const containerURL = ContainerURL.fromServiceURL(serviceURL, containerName);

    // List blobs
    let marker = undefined;
    do {
        const listBlobsResponse = await containerURL.listBlobFlatSegment(
            Aborter.none,
            marker
        );

        marker = listBlobsResponse.nextMarker;
        for (const blob of listBlobsResponse.segment.blobItems) {
            console.log(`Blob: ${blob.name}`);
        }
    } while (marker);

    // Get blob content from position 0 to the end
    // In Node.js, get downloaded data by accessing downloadBlockBlobResponse.readableStreamBody
    // In browsers, get downloaded data by accessing downloadBlockBlobResponse.blobBody
    // const downloadBlockBlobResponse = await blobURL.download(Aborter.none, 0);
    // console.log(
    //   "Downloaded blob content",
    //   await streamToString(downloadBlockBlobResponse.readableStreamBody)
    // );
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