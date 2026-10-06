const notFoundHandler = (req, res, next) => {
    res.status(404).render('errors/404', { title: '404 - Page Not Found' });
};

const errorHandler = (err, req, res, next) => {
    console.error('Unhandled Application Error:', err);
    res.status(500).render('errors/500', {
        title: '500 - Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
    });
};

module.exports = { notFoundHandler, errorHandler };
