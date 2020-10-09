const md = require('markdown-it')({
    html: true,
});
const mila = require('markdown-it-link-attributes');
const tm = require('markdown-it-texmath');
const katex = require('katex');
const fs = require('fs');
const path = require('path');
const jsdom = require('jsdom');
const readFileToString = require('./lib/util').readFileToString;

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
    return {
        name: path.basename(contentPath, markdownFileExtension),
        data: renderedContentData,
        text: renderedContentText
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
        .forEach(contentFileInfo => {
            contentIndex[contentFileInfo.name] = contentFileInfo;
        });
    
    fs.writeFile(contentIndexPath, JSON.stringify(contentIndex, null, '\t'), (err) => {
        if (err) {
            throw err;
        }

        console.log('Content index successfully built!');
    });
});