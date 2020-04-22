const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fileStorageService = require('./lib/fileStorageService');

const port = process.env.PORT || 3000;

function init() {
    const app = express();

    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'ejs');
    
    app.use(helmet());
    app.use(compression());
    app.use(express.static(path.resolve(__dirname, 'public')));

    app.get('/', async (req, res) => {
        const contentList = await fileStorageService.getAllContent();
        res.render('index', {
            contentList,
        });
    });

    app.get('/content/:name', async (req, res) => {
        var contentName = req.params.name || '';
        var contentObj = await fileStorageService.getContent(contentName);

        if (!contentObj) {
            res.redirect('/');
            return;
        }

        res.render('content', {
            prevContent: contentObj.prev,
            content: contentObj.content,
            nextContent: contentObj.next,
        });
    });

    app.get('/favicon.ico', (req, res) => {
        res.sendStatus(204);
    });

    app.get('*', (req, res) => {
        res.redirect('/');
    });

    app.listen(port,
        () => console.log(`Server started on port ${port}`));
}

init();