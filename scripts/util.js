const fs = require('fs');
const path = require('path');

const contentDirectoryPath = path.resolve('./content');
const markdownFileExtension = '.md';

function isMarkdownFile(name) {
    return path.extname(name) === markdownFileExtension;
}

function getContentName(contentName) {
    return path.basename(contentName, markdownFileExtension)
}

// A helper method used to read a Node.js readable stream into string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.setEncoding('UTF8');
        readableStream.on("data", data => {
            chunks.push(data.toString());
        });
        readableStream.on("end", () => {
            resolve(chunks.join(""));
        });
        readableStream.on("error", reject);
    });
}

async function readFileToString(filePath) {
    const readerStream = fs.createReadStream(filePath);
    return streamToString(readerStream);
}

async function getContentFiles() {
    return fs.promises.readdir(contentDirectoryPath)
        .then(contentFileNames => (
            contentFileNames
                .filter(isMarkdownFile)
                .map(contentFileName => ({
                    name: contentFileName,
                    path: path.resolve(contentDirectoryPath, contentFileName)
                }))));
}

module.exports = {
    getContentName,
    readFileToString,
    getContentFiles,
};