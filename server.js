const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const appInsights = require('applicationinsights');
const contentStorageServiceFactory = require('./lib/contentStorageService');
const wwwToNonWwwRedirect = require('./lib/wwwToNonWwwRedirect');

const contentDirectory = './public/content';
const port = process.env.PORT || 3000;
const appInsightsInstrumentationKey = "031b9eaf-2cd8-44e8-89ec-2f79f454ec25";

// Start Application Insights
appInsights
    .setup(appInsightsInstrumentationKey)
    .start();

function init() {
    const contentStorageServicePromise = contentStorageServiceFactory(contentDirectory);
    const app = express();

    app.set('views', './views');
    app.set('view engine', 'ejs');
    
    app.use(helmet());
    app.use(compression());
    app.use(wwwToNonWwwRedirect);
    app.use(express.static('public'))

    app.get('/', async (req, res) => {
        var contentStorageService = await contentStorageServicePromise;
        res.render('index', {
            contentList: contentStorageService.getAllContent(),
        });
    });

    app.get('/content/:name', async (req, res) => {
        var contentStorageService = await contentStorageServicePromise;
        var contentName = req.params.name || '';
        var content = contentStorageService.getContent(contentName);

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