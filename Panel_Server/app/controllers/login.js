

'use strict';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const logger = require('../modules/logger')('Login Controller');
const User = require('../modules/user');

const jwtSecretKey = config.jwt.key;
const steamApi = config.steam_api_key;

exports.loginPage = async (req, res) => {
  const isAdminRoute = (req.route.path === "/adminlogin") || (req.headers.referer && req.headers.referer.indexOf("/adminlogin") != -1);
  try {
    if (req.session.token || req.session.passport) return res.redirect('/');
    res.render('Login', {
      "steamLogin": (steamApi ? true : false),
      "adminRoute": isAdminRoute,
      "error": null
    });
  } catch (error) {
    logger.error("error in login-->", error);
    res.render('Login', {
      "steamLogin": (steamApi ? true : false),
      "adminRoute": isAdminRoute,
      "error": "Something went wrong contact Admin for more Info"
    });
  }
}

exports.authUserLogin = async (req, res) => {
  const isAdminRoute = req.headers.referer.indexOf("/adminlogin") != -1;
  try {
    let username = req.body.username;
    let password = req.body.password;
    // For the given username fetch user from DB
    const user = new User({
      username
    });
    const userData = await user.userInfo();
    if (!(username && password)) {
      return res.render('Login', {
        "steamLogin": (steamApi ? true : false),
        "adminRoute": isAdminRoute,
        "error": 'Authentication failed! Please check the request'
      });
    }
    bcrypt.compare(password, userData.password, function (err, result) {
      if (err || result != true) return res.render('Login', {
        "steamLogin": (steamApi ? true : false),
        "adminRoute": isAdminRoute,
        "error": 'Incorrect Username or Password'
      });

      const token = jwt.sign({ username: username },
        jwtSecretKey,
        {
          expiresIn: '7d' // expires in 7 day
        }
      );
      // return the JWT token for the future API calls
      req.session.token = token;
      req.session.username = userData.username;
      req.session.sec_key = userData.sec_key;
      req.session.user_type = userData.user_type;
      return res.redirect('/managevip');
    });
  } catch (error) {
    logger.error("error in authUserLogin-->", error);
    res.render('Login', {
      "steamLogin": (steamApi ? true : false),
      "adminRoute": isAdminRoute,
      "error": "Something went wrong contact Admin for more Info"
    })
  }
}
