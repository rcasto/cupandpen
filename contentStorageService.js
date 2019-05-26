const fs = require('fs');
const util = require('util');
const md = require('markdown-it')();
const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const markdownFileRegex = /^.*\.md$/;
const dataEncoding = 'utf8';
const contentStore = { };

async function init(contentPath) {
    try {
        var contentFiles = (await Promise.all((await readdir(contentPath, {
                encoding: dataEncoding,
                withFileTypes: true,
            }))
            .filter(contentFile => contentFile && contentFile.isFile())
            .filter(contentFile => markdownFileRegex.test(contentFile.name))
            .map(async contentFile => ({
                name: contentFile.name,
                data: md.render((await readFile(`./${contentPath}/${contentFile.name}`, dataEncoding)))
            }))
        ));

        contentFiles
            .forEach(contentFile => contentStore[contentFile.name] = contentFile);
    } catch (err) {
        console.error(`Failed to load content: ${err}`);
    }
}

function getAllContent() {
    return Object.keys(contentStore)
        .map(contentName => getContent(contentName));
}

function getContent(name) {
    if (contentStore[name]) {
        return Object.assign({}, contentStore[name]);
    }
    return null;
}

module.exports = async function (contentPath) {
    await init(contentPath);
    return {
        getAllContent,
        getContent,
    };
};