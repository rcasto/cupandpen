const md = require('markdown-it')();
const mila = require('markdown-it-link-attributes');
const fs = require('fs');
const util = require('util');
const path = require('path');
const config = require('../config.json');
const memoryCache = new (require('./memoryCache'))(config.cache.expirationTimeInMs, config.cache.maxAmountOfEntries);
const streamToString  = require('./util').streamToString;

const fsReadDirPromise = util.promisify(fs.readdir);
const fsStatPromise = util.promisify(fs.stat);

async function getPublishedContentTitles() {
    const publishedContentFileNames = await fsReadDirPromise(config.contentDir);
    const publishedContentMetadata = (await Promise.all((publishedContentFileNames || [])
        // filter to markdown files
        .filter(fileName => path.extname(fileName) === '.md')
        // add created timestamp to files
        .map(async fileName => {
            const stats = await fsStatPromise(path.resolve(config.contentDir, fileName));

            // check if current file happens to be directory
            // if so, mark as invalid, only want files
            if (stats.isDirectory()) {
                return null;
            }

            return {
                // remove '.md' from file names
                name: path.basename(fileName, path.extname(fileName)),
                timestamp: stats.ctimeMs,
            };
        })))
        // remove any invalid entries
        .filter(contentMetadata => !!contentMetadata);

    // sort by creation time, newest first (top)
    publishedContentMetadata
        .sort((contentMetadata1, contentMetadata2) => {
            return contentMetadata2.timestamp - contentMetadata1.timestamp;
        });

    return publishedContentMetadata
        .reduce((publishedContentMetadataMap, contentMetadata) => {
            publishedContentMetadataMap[contentMetadata.name] = contentMetadata;
            return publishedContentMetadataMap;
        }, {});
}

async function readFileToString(filePath) {
    const readerStream = fs.createReadStream(filePath);
    return util.streamToString(readerStream);
}

async function hasContentFile(contentName) {

}

async function getAllContent() {
    const containerContentsMap = memoryCache.get('/') || await getPublishedContentTitles();
    return Object.values(containerContentsMap);
}

async function getContent(name) {
    const containerContentsMap = memoryCache.get('/'); // || await getContainerContents();
    return containerContentsMap[name];
}

module.exports = {
    getAllContent,
    getContent
};