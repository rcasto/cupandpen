const express = require('express');
const requestActivity = require('express-request-activity');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const fileStorageService = require('./lib/fileStorageService');
const { logRequest, logError } = require('./lib/logger');

const port = process.env.PORT || 3000;
const contentSecurityPolicy = "default-src 'self' https://codepen.io; img-src 'self' data:; script-src 'self' https://cdn.jsdelivr.net https://static.codepen.io; style-src 'self' 'unsafe-inline';";

function onError(message, err) {
    logError(`Error: ${message}\n${JSON.stringify(err)}`);
}

function renderView(res, viewName, viewData) {
    res
        .set({
            'Content-Security-Policy': contentSecurityPolicy
        })
        .render(viewName, viewData);
}

function init() {
    const app = express();

    app.set('views', path.resolve(__dirname, 'views'));
    app.set('view engine', 'ejs');

    app.use(helmet());
    app.use(compression());

    app.use(requestActivity({
        lightPin: 11,
        lightOnTimeInMs: 200
    }));
    app.use(function (req, res, next) {
        logRequest(req);
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

        renderView(res, 'index', {
            contentList,
        });
    });

    app.get('/content/:name', async (req, res) => {
        const contentName = req.params.name || '';

        try {
            const contentObj = await fileStorageService.getContent(contentName);

            if (!contentObj) {
                logRequest(req, 'Redirecting to home, content not found');
                res.redirect('/');
                return;
            }

            renderView(res, 'content', {
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
        logRequest(req, 'Redirecting to home, unknown/unhandled path');
        res.redirect('/');
    });

    app.listen(port,
        () => console.log(`Server started on port ${port}`));
}

init();