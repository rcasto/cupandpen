const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const formatXML = require('xml-formatter');
const { getContentFiles } = require('./util');

const siteUrl = 'https://cupandpen.com';
const sitemapPath = 'docs/sitemap.xml';

async function generateSitemap() {
    const contentFiles = await getContentFiles();
    const sitemap = new SitemapStream({
        hostname: siteUrl
    });
    const currentDate = new Date();

    // add content pages
    contentFiles
        .forEach(contentFile => {
            sitemap.write({
                url: `${siteUrl}/content/${contentFile.name}`,
                lastmod: currentDate,
            });
        });

    // add index/home page
    sitemap.write({
        url: `${siteUrl}`,
        lastmod: currentDate,
    });

    sitemap.end();

    const sitemapBuffer = await streamToPromise(sitemap);
    const sitemapString = sitemapBuffer.toString();

    await fs.promises.writeFile(sitemapPath, formatXML(sitemapString));
}

generateSitemap()
    .catch(err => console.error(err));