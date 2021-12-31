const fs = require('fs');
const { SitemapStream, streamToPromise, parseSitemap } = require('sitemap');
const formatXML = require('xml-formatter');
const { getContentFiles } = require('./util');

const siteUrl = 'https://cupandpen.com';
const sitemapPath = 'public/sitemap.xml';

async function getExistingSitemapItems() {
    const siteMapReadStream = fs.createReadStream(sitemapPath);
    const sitemapItems = await parseSitemap(siteMapReadStream);
    return sitemapItems;
}

async function getCurrentSitemapItems() {
    const sitemapItems = [];
    const contentFiles = await getContentFiles();
    const currentDate = new Date();

    // add content pages
    contentFiles
        .forEach(contentFile => {
            sitemapItems.push({
                url: `${siteUrl}/content/${encodeURIComponent(contentFile.name)}`,
                lastmod: currentDate,
            });
        });

    // add index/home page
    sitemapItems.push({
        url: `${siteUrl}/`,
        lastmod: currentDate,
    });

    return sitemapItems;
}

async function generateSitemap() {
    const sitemap = new SitemapStream({
        hostname: siteUrl
    });

    const existingSitemapItems = await getExistingSitemapItems();
    const currentSitemapItems = await getCurrentSitemapItems();

    const existingSitemapItemMap = new Map();
    existingSitemapItems
        .forEach(existingSitemapItem =>
            existingSitemapItemMap.set(existingSitemapItem.url, existingSitemapItem));

    currentSitemapItems
            .forEach(currentSitemapItem => {
                // console.log(currentSitemapItem.url, existingSitemapItemMap.has(currentSitemapItem.url));

                // sitemap item for current entry already existed in sitemap
                // let's preserve the original sitemap record
                if (existingSitemapItemMap.has(currentSitemapItem.url)) {
                    const existingSitemapItemRecord = existingSitemapItemMap.get(currentSitemapItem.url);
                    sitemap.write(existingSitemapItemRecord);
                } else {
                    sitemap.write(currentSitemapItem);
                }
            });

    sitemap.end();

    const sitemapBuffer = await streamToPromise(sitemap);
    const sitemapString = sitemapBuffer.toString();

    await fs.promises.writeFile(sitemapPath, formatXML(sitemapString));
}

generateSitemap()
    .catch(err => console.error(err));