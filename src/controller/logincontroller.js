'use strict';

const axios = require('axios');
const querystring = require('querystring');
const config = require('../../config');

const AUTH_TOKEN = `Basic ${new Buffer(config.api.clientId + ':' + config.api.clientSecret).toString('base64')}`;

function auth(username, password) {
  return axios.post(config.api.authUrl,
    querystring.stringify({
      username: username,
      password: password,
      grant_type: 'password'
    }),{
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": AUTH_TOKEN
      }
    });
}

function get(req, res) {
  res.render('login');
}

function post(req, res) {
  if (!req.body.username || !req.body.password) {
    req.flash('error', 'Invalid user id or password');
    res.redirect('/login');
    return;
  }

  auth(req.body.username, req.body.password)
    .then(({data}) => {
      req.session.token = data.access_token;
      res.redirect('/');
    })
    .catch((error) => {
      if (error.response.statusCode === 401) {
        req.flash('error', 'Invalid user id or password');
        res.redirect('/');
        return;
      }

      req.error = error.error;
      res.redirect('/error');
    });
}

function logout(req, res) {
  delete req.session.token;
  res.redirect('/login');
}

module.exports = { get, post, logout };
