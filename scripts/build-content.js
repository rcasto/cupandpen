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
const matter = require('gray-matter');
const { format } = require('date-fns');
const readFileToString = require('./util').readFileToString;

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
    const contentMatter = matter(contentData);
    const renderedContentData = md.render(contentMatter.content);
    const renderedContentText = JSDOM.fragment(renderedContentData).textContent || '';
    const stats = await fsStatPromise(contentPath);
    return {
        name: path.basename(contentPath, markdownFileExtension),
        data: renderedContentData,
        text: renderedContentText,
        timestamp: contentMatter.data.timestamp,
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
            const prevContent = contentFilesInfo[contentFileInfoIndex - 1] || null;
            const nextContent = contentFilesInfo[contentFileInfoIndex + 1] || null;

            contentIndex[contentFileInfo.name] = {
                ...contentFileInfo,
                timestamp: format(new Date(contentFileInfo.timestamp), 'MMMM d, yyyy'),
                prev: prevContent ? {
                    name: prevContent.name,
                } : null,
                next: nextContent ? {
                    name: nextContent.name,
                } : null,
            };
        });
    
    fs.writeFile(contentIndexPath, JSON.stringify(contentIndex, null, '\t'), (err) => {
        if (err) {
            throw err;
        }

        console.log('Content index successfully built!');
    });
});