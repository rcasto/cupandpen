const hostHeader = 'host';
const permanentRedirectStatusCode = 301;
const wwwRegex = /^www\./;

function wwwToNonWwwRedirect(req, res, next) {
    let hostValue = req.get(hostHeader) || req.hostname;
    if (wwwRegex.test(hostValue)) {
        hostValue = hostValue.replace(wwwRegex, '');
        res.redirect(permanentRedirectStatusCode, `${req.protocol}://${hostValue}${req.originalUrl}`);
    } else {
        next();
    }
}

module.exports = wwwToNonWwwRedirect;