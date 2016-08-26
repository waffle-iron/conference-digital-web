'use strict';

const rp = require('request-promise');
const config = require('../../config');

function auth(username, password) {
  var options = {
    method: 'POST',
    url: config.api.authUrl,

    headers:
    {
      'cache-control': 'no-cache',
      authorization: `Basic ${new Buffer(config.api.clientId + ':' + config.api.clientSecret).toString('base64')}`,
      'content-type': 'multipart/form-data; boundary=---011000010111000001101001'
    },
    formData:
    {
      username: username,
      password: password,
      grant_type: 'password'
    },
    json: true
  };

  return rp(options);
}


function get(req, res) {
  res.render('login');
}

function post(req, res) {

  if (!req.body.username || !req.body.password) {
    res.redirect('/login');
    return;
  }

  auth(req.body.username, req.body.password)
    .then((data) => {
      req.session.token = data.access_token;
      res.redirect('/');
    })
    .catch((error) => {
      console.log('Error logging in:', error.error);
      req.error = error.error;
      res.redirect('/error');
    });

}

function logout(req, res) {
  delete req.session.token;
  res.redirect('/login');
}

module.exports = { get, post, logout };
