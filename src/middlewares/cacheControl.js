const cacheControl = (req, res, next) => {
    if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300');
        const now = new Date().toUTCString();
        res.set('Last-Modified', now);
    } else {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }
    next();
};

module.exports = cacheControl;