const md = require('markdown-it')();
const mila = require('markdown-it-link-attributes');
const fs = require('fs');
const util = require('util');
const path = require('path');
const jsdom = require('jsdom');
const config = require('../config.json');
const memoryCache = new (require('./memoryCache'))(config.cache.expirationTimeInSeconds);
const readFileToString  = require('./util').readFileToString;

const fsReadDirPromise = util.promisify(fs.readdir);
const fsStatPromise = util.promisify(fs.stat);

const { JSDOM } = jsdom;

md.use(mila, {
    attrs: {
        target: '_blank',
    }
});

function getContentPath(name) {
    return path.resolve(config.contentDir, name);
}

async function getPublishedContentMetadata() {
    const publishedContentFileNames = await fsReadDirPromise(config.contentDir);
    const publishedContentMetadata = (await Promise.all((publishedContentFileNames || [])
        // filter to markdown files
        .filter(fileName => path.extname(fileName) === '.md')
        // add created timestamp to files
        .map(async fileName => {
            const stats = await fsStatPromise(getContentPath(fileName));

            // check if current file happens to be directory
            // if so, mark as invalid, only want files
            if (stats.isDirectory()) {
                return null;
            }

            return {
                // remove '.md' from file names
                name: path.basename(fileName, path.extname(fileName)),
                timestamp: stats.mtimeMs,
            };
        })))
        // remove any invalid entries
        .filter(contentMetadata => !!contentMetadata);

    // sort by last modified time, most recently modified first (top)
    publishedContentMetadata
        .sort((contentMetadata1, contentMetadata2) => {
            return contentMetadata2.timestamp - contentMetadata1.timestamp;
        });

    const publishedContentMetadataMap = publishedContentMetadata
        .reduce((publishedContentMetadataMap, contentMetadata, contentIndex, publishedContentMetadata) => {
            const prevContent = publishedContentMetadata[contentIndex - 1] || null;
            const nextContent = publishedContentMetadata[contentIndex + 1] || null;
            publishedContentMetadataMap[contentMetadata.name] = {
                ...contentMetadata,
                prev: prevContent,
                next: nextContent
            };
            return publishedContentMetadataMap;
        }, {});

    memoryCache.add('/', publishedContentMetadataMap);

    return publishedContentMetadataMap;
}

async function getPublishedContentData(name) {
    const contentData = await readFileToString(`${getContentPath(name)}.md`);
    const renderedContentData = md.render(contentData);
    const renderedContentText = JSDOM.fragment(renderedContentData).textContent || '';
    memoryCache.add(name, {
        name,
        data: renderedContentData,
        text: renderedContentText
    });
    return memoryCache.get(name);
}

async function getAllContent() {
    const containerContentsMap = memoryCache.get('/') || await getPublishedContentMetadata();
    return Object.values(containerContentsMap);
}

async function getContent(name) {
    const contentMetadataMap = memoryCache.get('/') || await getPublishedContentMetadata();
    if (!contentMetadataMap[name]) {
        return null;
    }
    const contentData = memoryCache.get(name) || await getPublishedContentData(name);
    return {
        prev: contentMetadataMap[name].prev,
        next: contentMetadataMap[name].next,
        content: contentData
    };
}

module.exports = {
    getAllContent,
    getContent
};