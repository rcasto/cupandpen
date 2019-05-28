const express = require('express');
const compression = require('compression');
const contentStorageServiceFactory = require('./contentStorageService');

const contentDirectory = './public/content';
const port = process.env.PORT || 3000;

function init() {
    const contentStorageServicePromise = contentStorageServiceFactory(contentDirectory);
    const app = express();

    app.set('views', './views');
    app.set('view engine', 'ejs');
    
    app.use(compression());
    app.use(express.static('public'))

    app.get('/', async (req, res) => {
        var contentStorageService = await contentStorageServicePromise;
        res.render('index', {
            contentList: contentStorageService.getAllContent(),
        });
    });

    app.get('/content', (req, res) => {
        res.redirect('/');
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

    app.listen(port,
        () => console.log(`Server started on port ${port}`));
}

init();