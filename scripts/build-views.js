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
const matter = require('gray-matter');
const { format } = require('date-fns');
const cheerio = require('cheerio');
const { getContentName, getContentFiles, readFileToString } = require('./util');

const writeFilePromise = util.promisify(fs.writeFile);

const indexView = path.resolve('views/index.ejs');
const contentView = path.resolve('views/content.ejs');
const indexViewOutput = path.resolve('docs/index.html');
const contentViewOutput = path.resolve('docs/content');

md.use(mila, {
    pattern: /^(https|http):/,
    attrs: {
        target: '_blank',
        rel: 'noopener noreferrer'
    }
});
md.use(tm, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: {
        output: 'mathml'
    }
});

async function renderView(viewPath, data) {
    const viewString = await ejs.renderFile(viewPath, data);
    const $ = cheerio.load(viewString);
    return $.html();
}

async function getContentData(contentPath) {
    const contentData = await readFileToString(contentPath);
    const contentMatter = matter(contentData);
    const renderedContentData = md.render(contentMatter.content);
    const $ = cheerio.load(renderedContentData);
    const renderedContentText = $.root().text() || '';
    const contentName = getContentName(contentPath);
    const sharingText = encodeURIComponent('Check this out!');
    const sharingUrl = encodeURIComponent(`https://cupandpen.com/content/${encodeURIComponent(contentName)}`);
    const contentDeps = (contentMatter.data.deps || '')
        .split(',')
        .filter(dep => !!dep);
    return {
        name: contentName,
        data: renderedContentData,
        text: renderedContentText,
        timestamp: contentMatter.data.timestamp,
        sharing: {
            twitter: `https://twitter.com/intent/tweet?text=${sharingText}&url=${sharingUrl}`,
            mailto: `mailto:?subject=${sharingText}&body=${sharingUrl}`
        },
        deps: {
            codebed: contentDeps.includes('code-bed'),
        }
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

getContentFiles()
    .then(async contentFiles => {
        const contentFilesInfo = await Promise.all(
            contentFiles
                .map(contentFile => getContentData(contentFile.path)));
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
    })
    .catch(err => console.error(err));