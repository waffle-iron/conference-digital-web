'use strict';

const express = require('express');
const router = express.Router();
const config = require('../../config');
const rp = require('request-promise');


function index(req, res) {

  const options = {
    method: 'GET',
    url: `${config.api.baseUrl}/locations/`,
    headers: {
      'Authorization': `Bearer ${req.session.token}`,
      'content-type': 'application/json'
    },
    json: true
  };

  rp(options)
    .then((data) => {
      res.render('locations/index', {
        section: 'locations',
        locations: data
      });
    })
    .catch((error) => {
      res.render('error' , { error: error.error });
    });

}

function add(req, res) {
  res.render('locations/add', {
    section: 'locations'
  });
}

function edit(req, res) {
  res.render('locations/edit', {
    section: 'locations'
  });
}

function remove(req, res) {
  res.redirect('/locations');
}


router.get('/', index);
router.get('/add', add);
router.post('/', add);
router.get('/:id', edit);
router.get('/:id/remove', remove);


module.exports = { router, index, add, edit, remove };
