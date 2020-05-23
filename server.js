const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fileStorageService = require('./lib/fileStorageService');
const { logRequest, logError } = require('./lib/logger');

const port = process.env.PORT || 3000;

function onError(message, err) {
    logError(`Error: ${message}\n${JSON.stringify(err)}`);
}

function init() {
    const app = express();

    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'ejs');
    
    app.use(helmet());
    app.use(compression());

    app.use(function (req, res, next) {
        logRequest(req.path, `Request: ${req.path}`);
        next()
    });
    app.use(express.static(path.resolve(__dirname, 'public')));

    app.get('/', async (req, res) => {
        let contentList = [];

        try {
            contentList = await fileStorageService.getAllContent();
        } catch (err) {
            onError(`Failed to load home page`, err);
        }

        res.render('index', {
            contentList,
        });
    });

    app.get('/content/:name', async (req, res) => {
        const contentName = req.params.name || '';

        try {
            const contentObj = await fileStorageService.getContent(contentName);

            if (!contentObj) {
                res.redirect('/');
                logRequest(req.path, `Redirecting to home, content not found: ${req.path}`);
                return;
            }

            res.render('content', {
                prevContent: contentObj.prev,
                content: contentObj.content,
                nextContent: contentObj.next,
            });
        } catch (err) {
            onError(`Failed to load content ${contentName}`, err);
        }
    });

    app.get('/favicon.ico', (req, res) => {
        res.sendStatus(204);
    });

    app.get('*', (req, res) => {
        logRequest(req.path, `Redirecting to home, unknown/unhandled path: ${req.path}`);
        res.redirect('/');
    });

    app.listen(port,
        () => console.log(`Server started on port ${port}`));
}

init();