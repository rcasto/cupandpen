const path = require('path');
const ejs = require('ejs');

const contentIndex = require('../index.json');
const indexView = path.resolve('views/index.ejs');
const contentView = path.resolve('views/content.ejs');

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
    const contentIndexView = await renderContentIndexView();

    console.log(contentIndexView);
}

generateViews()
    .catch(err => console.error(err));