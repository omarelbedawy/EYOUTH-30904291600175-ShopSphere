const logger = require('./logger');

// Logs every request once it finishes, with method, path, status code,
// duration, and severity — 'error' for 5xx responses, 'warn' for 4xx,
// 'info' for everything else.
function requestLogger(req, res, next) {
    const start = Date.now();

    res.on('finish', () => {
        const durationMs = Date.now() - start;
        const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';

        logger[level]('request completed', {
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs
        });
    });

    next();
}

// Catches anything thrown/passed to next(err) in route handlers, logs it
// with full context, then responds — this should be the LAST app.use().
function errorLogger(err, req, res, next) {
    logger.error('unhandled error', {
        method: req.method,
        path: req.originalUrl,
        message: err.message,
        stack: err.stack
    });

    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}

module.exports = { requestLogger, errorLogger };