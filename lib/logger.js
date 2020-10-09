const winston = require('winston');
const path = require('path');

const errorLogFilePath = path.resolve(__dirname, '../logs', 'errorLog.log');
const requestLogFilePath = path.resolve(__dirname, '../logs', 'requestLog.log');
const defaultFileTransportOptions = {
    maxFiles: 1,
    maxsize: 1000000000, // 1 GB
    tailable: true
};
const ignoredRequestPaths = [
    /styles\/style.css$/,
    /\/favicon.ico$/,
    /\/images\/.+$/,
];

const requestLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ ...defaultFileTransportOptions, filename: requestLogFilePath })
    ]
});
const errorLogger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ ...defaultFileTransportOptions, filename: errorLogFilePath, level: 'error' })
    ]
});

function log(logger, message) {
    // logger(`${Date.now()}: ${message}`);
}

/**
 * 
 * @param {Express.Request} req 
 * @param {string} message 
 * @returns {void}
 */
function logRequest(req, message) {
    if (ignoredRequestPaths.some(ignoredRequestPathPattern => ignoredRequestPathPattern.test(req.path))) {
        return;
    }
    let logMessage = `Path = $${req.path || ''}`;
    if (message) {
        logMessage = `${logMessage}; Message = ${message}`;
    }
    log(requestLogger.info, logMessage);
}

function logError(error) {
    log(errorLogger.error, error);
}

module.exports = {
    logRequest,
    logError
};