

'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');
const jwtSecretKey = config.jwt.key;
const steamAPIKey = config.steam_api_key;

/**
 * check token middleware
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const checkToken = (req, res, next) => {
    const token = req.session.token || req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    let jwtToken = token;
    const isAdminRoute = req.route.path === "/adminlogin" || req.headers.referer.indexOf("/adminlogin") != -1;
    if (token) {
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            jwtToken = token.slice(7, token.length);
        }

        jwt.verify(jwtToken, jwtSecretKey, (err, decoded) => {
            if (err) {
                if (req.body.apiCall) {
                    res.json({
                        success: false,
                        data: { "error": err, "message": "Acesso não autorizado, se você for um admin, entre novamente." }
                    });
                } else {
                    return res.render('Login', {
                        "steamLogin": (steamAPIKey ? true : false),
                        "adminRoute": isAdminRoute,
                        "error": "Acesso não autorizado, se você for um admin, entre novamente."
                    });
                }
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        if (req.body.apiCall) {
            res.json({
                success: false,
                data: { "error": "Token faltando, a sessão expirou", "message": "Acesso não autorizado, se você for um admin, entre novamente." }
            });
        }else{
        return res.render('Login',
            {
                "steamLogin": (steamAPIKey ? true : false),
                "adminRoute": isAdminRoute,
                "error": "Acesso não autorizado, se você for um admin, entre novamente."
            });}
    }
};

/**
 * check steam authentication middleware
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next 
 */
const checkSteamAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/');
};

module.exports = {
    checkToken,
    checkSteamAuthenticated
};