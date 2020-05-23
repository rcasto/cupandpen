const winston = require('winston');
const path = require('path');

const errorLogFilePath = path.resolve(__dirname, '../logs', 'errorLog.log');
const requestLogFilePath = path.resolve(__dirname, '../logs', 'requestLog.log');
const cacheLogFilePath = path.resolve(__dirname, '../logs', 'cacheLog.log');
const defaultFileTransportOptions = {
    maxFiles: 1,
    maxsize: 1000000000, // 1 GB
    tailable: true
};
const ignoredRequestPaths = [
    /styles\/style.css$/
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
const cacheLogger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ ...defaultFileTransportOptions, filename: cacheLogFilePath })
    ]
});

function log(logger, message) {
    logger(`${Date.now()}: ${message}`);
}

function logRequest(requestPath, message) {
    if (ignoredRequestPaths.some(ignoredRequestPathPattern => ignoredRequestPathPattern.test(requestPath))) {
        return;
    }
    log(requestLogger.info, message);
}

function logCache(message) {
    log(cacheLogger.info, message);
}

function logError(error) {
    log(errorLogger.error, error);
}

module.exports = {
    logRequest,
    logCache,
    logError
};