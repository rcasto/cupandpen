const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const { logRequest } = require('./lib/logger');

const contentIndex = require('./index.json');

const port = process.env.PORT || 3000;
const contentSecurityPolicy = "default-src 'self' https://codepen.io; img-src 'self' data:; script-src 'self' https://cdn.jsdelivr.net https://static.codepen.io; style-src 'self' 'unsafe-inline';";

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

    app.use(function (req, res, next) {
        logRequest(req);
        next()
    });
    app.use(express.static(path.resolve(__dirname, 'public')));

    app.get('/', (req, res) => {
        let contentList = Object.values(contentIndex);

        renderView(res, 'index', {
            contentList,
        });
    });

    app.get('/content/:name', (req, res) => {
        const contentName = req.params.name || '';
        const contentObj = contentIndex[contentName];

        if (!contentObj) {
            logRequest(req, 'Redirecting to home, content not found');
            res.redirect('/');
            return;
        }

        renderView(res, 'content', {
            prevContent: contentObj.prev,
            content: contentObj,
            nextContent: contentObj.next,
        });
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