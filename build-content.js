const md = require('markdown-it')({
    html: true,
});
const mila = require('markdown-it-link-attributes');
const tm = require('markdown-it-texmath');
const katex = require('katex');
const fs = require('fs');
const path = require('path');
const util = require('util');
const jsdom = require('jsdom');
const readFileToString = require('./lib/util').readFileToString;

const fsStatPromise = util.promisify(fs.stat);

const contentDirectoryPath = path.resolve('./content');
const contentIndexPath = path.resolve('./index.json');
const markdownFileExtension = '.md';

const { JSDOM } = jsdom;

md.use(mila, {
    attrs: {
        target: '_blank',
    }
});
md.use(tm, {
    engine: katex,
    delimiters:'dollars',
    katexOptions: {
        output: 'mathml'
    }
});

async function getPublishedContentData(contentPath) {
    const contentData = await readFileToString(contentPath);
    const renderedContentData = md.render(contentData);
    const renderedContentText = JSDOM.fragment(renderedContentData).textContent || '';
    const stats = await fsStatPromise(contentPath);
    return {
        name: path.basename(contentPath, markdownFileExtension),
        data: renderedContentData,
        text: renderedContentText,
        timestamp: stats.mtimeMs
    };
}

function isMarkdownFile(name) {
    return path.extname(name) === markdownFileExtension;
}

fs.readdir(contentDirectoryPath, async (err, contentNames) => {
    if (err) {
        throw err;
    }

    const contentFilesInfo = await Promise.all(
        contentNames
            .filter(isMarkdownFile)
            .map(contentName => path.resolve(contentDirectoryPath, contentName))
            .map(getPublishedContentData)
    );
    const contentIndex = {};

    contentFilesInfo
        .sort((contentFileInfo1, contentFileInfo2) => {
            return contentFileInfo2.timestamp - contentFileInfo1.timestamp;
        })
        .forEach((contentFileInfo, contentFileInfoIndex) => {
            contentIndex[contentFileInfo.name] = {
                ...contentFileInfo,
                prev: contentFilesInfo[contentFileInfoIndex - 1] || null,
                next: contentFilesInfo[contentFileInfoIndex + 1] || null
            };
        });
    
    fs.writeFile(contentIndexPath, JSON.stringify(contentIndex, null, '\t'), (err) => {
        if (err) {
            throw err;
        }

        console.log('Content index successfully built!');
    });
});