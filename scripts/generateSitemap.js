const fs = require('fs');
const util = require('util');
const { SitemapStream, streamToPromise } = require('sitemap');
const formatXML = require('xml-formatter');
const fileStorageService = require('../lib/fileStorageService');

const fsWriteFilePromise = util.promisify(fs.writeFile);

const siteUrl = 'https://cupandpen.com';
const sitemapPath = 'public/sitemap.xml';

async function generateSitemap() {
    try {
        const allContentMetadata = await fileStorageService.getAllContent();
        const sitemap = new SitemapStream({
            hostname: siteUrl
        });
        const currentDate = new Date();

        allContentMetadata
            .forEach(contentMetadata => {
                sitemap.write({
                    url: `${siteUrl}/content/${contentMetadata.name}`,
                    lastmod: currentDate,
                });
            });
        sitemap.end();

        const sitemapBuffer = await streamToPromise(sitemap);
        const sitemapString = sitemapBuffer.toString();

        await fsWriteFilePromise(sitemapPath, formatXML(sitemapString));
    } catch (err) {
        console.error(err);
    }
}

generateSitemap();