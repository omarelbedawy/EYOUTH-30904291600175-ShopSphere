// Minimal structured logger — no external dependency needed for a project
// this size. Every line is a single JSON object with a timestamp and a
// severity level, which is what most log viewers (including Vercel's) can
// parse and filter on directly.
function log(level, message, meta = {}) {
    const entry = {
        timestamp: new Date().toISOString(),
        level,
        message,
        ...meta
    };

    // console.error routes to stderr so error-level logs are separated from
    // info-level ones in most log viewers, including Vercel's.
    if (level === 'error') {
        console.error(JSON.stringify(entry));
    } else {
        console.log(JSON.stringify(entry));
    }
}

module.exports = {
    info: (message, meta) => log('info', message, meta),
    warn: (message, meta) => log('warn', message, meta),
    error: (message, meta) => log('error', message, meta)
};