const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const util = require('util');

const contentIndex = require('../index.json');
const indexView = path.resolve('views/index.ejs');
const contentView = path.resolve('views/content.ejs');

const writeFilePromise = util.promisify(fs.writeFile);

const indexViewOutput = path.resolve('public/index.html');
const contentViewOutput = path.resolve('public/content');

async function renderView(viewPath, data) {
    return await ejs.renderFile(viewPath, data);
}

async function renderContentView(contentName) {
    const contentObj = contentIndex[contentName];
    return await renderView(contentView, {
        prevContent: contentObj.prev,
        content: contentObj,
        nextContent: contentObj.next
    });
}

async function renderContentIndexView() {
    const contentList = Object.values(contentIndex);
    return await renderView(indexView, {
        contentList
    });
}

async function generateViews() {
    try {
        const contentIndexView = await renderContentIndexView();
        await writeFilePromise(indexViewOutput, contentIndexView);

        Object.keys(contentIndex)
            .map(async contentName => {
                const contentViewPath = path.resolve(contentViewOutput, `${contentName}.html`);
                const contentNameView = await renderContentView(contentName);
                await writeFilePromise(contentViewPath, contentNameView);
            });

        console.log('Content views successfully built!')
    } catch (err) {
        console.error(`An error occurred building content views\n${err}`);
    }
}

generateViews()
    .catch(err => console.error(err));