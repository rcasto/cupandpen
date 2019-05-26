const fs = require('fs');
const util = require('util');
const express = require('express');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

const dataDirectory = './data';
const dataEncoding = 'utf8';
const jsonFileRegex = /^.*\.json$/;
const port = 3000;
const app = express();

// Load content into memory
loadContent();

app.set('views', './views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(port,
    () => console.log(`Server started on port ${port}`));

async function loadContent() {
    try {
        var contentConfigs = (await Promise.all((await readdir(dataDirectory, {
                encoding: dataEncoding,
                withFileTypes: true,
            }))
            .filter(contentConfig => contentConfig && contentConfig.isFile())
            .filter(contentConfig => jsonFileRegex.test(contentConfig.name))
            .map(async contentConfig => await readFile(`./${dataDirectory}/${contentConfig.name}`, dataEncoding))
        ))
        .map(contentConfig => {
            try {
                return JSON.parse(contentConfig);
            } catch(err) {
                return null;
            }
        })
        .filter(contentConfig => !!contentConfig);

        contentConfigs
            .forEach(contentConfig => console.log(contentConfig.title));
    } catch (err) {
        console.error(`Failed to load content: ${err}`);
    }
}