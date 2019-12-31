const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const appInsights = require('applicationinsights');
const blobStorageService = require('./lib/blobStorageService');
const wwwToNonWwwRedirect = require('./lib/wwwToNonWwwRedirect');
const config = require('./config.json');

const port = process.env.PORT || 3000;

// Start Application Insights
appInsights
    .setup(config.appInsights.key)
    .start();

function init() {
    const app = express();

    app.set('views', './views');
    app.set('view engine', 'ejs');
    
    app.use(helmet());
    app.use(compression());
    app.use(wwwToNonWwwRedirect);
    app.use(express.static('public'))

    app.get('/', async (req, res) => {
        const contentList = await blobStorageService.getAllContent();
        res.render('index', {
            contentList: contentList
                .sort((content1, content2) => {
                    return content2.timestamp - content1.timestamp;
                })
        });
    });

    app.get('/content/:name', async (req, res) => {
        var contentName = req.params.name || '';
        var content = await blobStorageService.getContent(contentName);

        if (!content) {
            res.redirect('/');
            return;
        }

        res.render('content', {
            content,
        });
    });

    app.get('*', (req, res) => {
        res.redirect('/');
    });

    app.listen(port,
        () => console.log(`Server started on port ${port}`));
}

init();