const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const request = require('request');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

const baseWebsiteDomain = 'cupandpen.com';
const baseWebsiteHttp = `http://${baseWebsiteDomain}`;
const baseWebsiteHttps = `https://${baseWebsiteDomain}`;

function toLinkList(nodeLinkList) {
    const links = [];
    nodeLinkList.forEach(nodeLink => {
        links.push(nodeLink);
    });
    return links;
}

async function crawlUrlLinks(urlBase, urlPath = '/', visitedUrls = new Set(), crawlDepth = 1) {
    visitedUrls.add(urlPath);

    try {
        const urlHTML = await getUrlHTML(`${urlBase}${urlPath}`);
        const dom = new JSDOM(urlHTML);
        const links = toLinkList(dom.window.document.querySelectorAll("a"));

        await Promise.all(links.map(async link => {
            if (visitedUrls.has(link.href) ||
                crawlDepth - 1 < 0) {
                return;
            }
            await crawlUrlLinks(urlBase, link.href, visitedUrls, crawlDepth - 1);
        }));

        return [...visitedUrls];
    } catch (error) {
        console.error(error);
    }
}

function getUrlHTML(url) {
    console.log(`Fetching ${url}`);
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            console.log(`Fetched ${url} - ${response.statusCode}`);
            if (response.statusCode !== 200) {
                return reject(error);
            }
            return resolve(body);
        });
    });
}

function startSitemapUpdate() {
    crawlUrlLinks(baseWebsiteHttp)
        .then(siteLinks => {
            console.log(`Site Links:\n${siteLinks}`);

            const currentDate = new Date();
            const sitemap = new SitemapStream({
                hostname: baseWebsiteHttps,
            });
            siteLinks
                .forEach(siteLink => {
                    sitemap.write({
                        url: siteLink,
                        lastmod: currentDate,
                    });
                });
            sitemap.end();
            
            streamToPromise(sitemap)
                .then(sm => {
                    const siteMapString = sm.toString();

                    console.log(`Sitemap:\n${siteMapString}`);

                    fs.writeFile("public/sitemap.xml", siteMapString, (err) => {
                        if (err) {
                            return console.error(err);
                        }
                        console.log("Sitemap file was updated!");
                    });
                })
                .catch(console.error);
        });
}

startSitemapUpdate();