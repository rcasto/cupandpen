const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const contentStorageServiceFactory = require('./lib/contentStorageService');
const httpsRedirect = require('./lib/httpsRedirect');
const wwwToNonWwwRedirect = require('./lib/wwwToNonWwwRedirect');

const contentDirectory = './public/content';
const port = process.env.PORT || 3000;

function init() {
    const contentStorageServicePromise = contentStorageServiceFactory(contentDirectory);
    const app = express();

    app.set('views', './views');
    app.set('view engine', 'ejs');
    
    app.use(helmet());
    app.use(compression());
    app.use(httpsRedirect);
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
            res.sendStatus(404);
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