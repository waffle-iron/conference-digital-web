'use strict';

module.exports = function auth(req, res, next) {

  if (req.url !== '/login' && !req.session.token) {
    console.log('redirect');
    res.redirect('/login');
    return;
  }

  next();

};
