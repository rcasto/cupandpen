const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const util = require('util');
const md = require('markdown-it')({
    html: true,
});
const mila = require('markdown-it-link-attributes');
const tm = require('markdown-it-texmath');
const katex = require('katex');
const jsdom = require('jsdom');
const matter = require('gray-matter');
const { format } = require('date-fns');
const readFileToString = require('./util').readFileToString;

const writeFilePromise = util.promisify(fs.writeFile);

const contentDirectoryPath = path.resolve('./content');
const markdownFileExtension = '.md';
const indexView = path.resolve('views/index.ejs');
const contentView = path.resolve('views/content.ejs');
const indexViewOutput = path.resolve('docs/index.html');
const contentViewOutput = path.resolve('docs/content');

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

function isMarkdownFile(name) {
    return path.extname(name) === markdownFileExtension;
}

async function renderView(viewPath, data) {
    return await ejs.renderFile(viewPath, data);
}

async function getPublishedContentData(contentPath) {
    const contentData = await readFileToString(contentPath);
    const contentMatter = matter(contentData);
    const renderedContentData = md.render(contentMatter.content);
    const renderedContentText = JSDOM.fragment(renderedContentData).textContent || '';
    return {
        name: path.basename(contentPath, markdownFileExtension),
        data: renderedContentData,
        text: renderedContentText,
        timestamp: contentMatter.data.timestamp,
    };
}

async function renderContentView(contentIndex, contentName) {
    const contentObj = contentIndex[contentName];
    return await renderView(contentView, {
        prevContent: contentObj.prev,
        content: contentObj,
        nextContent: contentObj.next
    });
}

async function renderContentIndexView(contentIndex) {
    const contentList = Object.values(contentIndex);
    return await renderView(indexView, {
        contentList
    });
}

async function generateViews(contentIndex) {
    try {
        const contentIndexView = await renderContentIndexView(contentIndex);
        await writeFilePromise(indexViewOutput, contentIndexView);

        Object.keys(contentIndex)
            .map(async contentName => {
                const contentViewPath = path.resolve(contentViewOutput, `${contentName}.html`);
                const contentNameView = await renderContentView(contentIndex, contentName);
                await writeFilePromise(contentViewPath, contentNameView);
            });

        console.log('Content views successfully built!')
    } catch (err) {
        console.error(`An error occurred building content views\n${err}`);
    }
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

    generateViews(contentIndex)
        .catch(err => console.error(err));
});