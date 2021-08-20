
'use strict';

/**
 * Not Found middleware
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const notFound = (req, res, next) => {
    if (req.method === 'GET') {
        return res.status(404).render('404');
    }
    res.status(404).json({
        id: req.uuid,
        method: req.method,
        message: `Route: '${req.originalUrl}' not found`
    });
};

module.exports = {
    notFound
};