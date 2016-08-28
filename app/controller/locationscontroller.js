'use strict';

const express = require('express');
const router = express.Router();
const config = require('../../config');
const rp = require('request-promise');

const labels = {
  title: 'Location name',
  description: 'Description',
  address_1: "Address",
  address_2: "Address 2",
  address_town: "Town",
  address_county: "County",
  address_country: "Country",
  zipcode: "Postcode/Zipcode "
};

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

function update(req, res) {

  // get the form data
  let location = req.body;
  let options = {
    headers: {
      'Authorization': `Bearer ${req.session.token}`,
      'content-type': 'application/json'
    },
    json: true,
    body: location
  };

  if (location.id && location.id.length > 0) {
    options.method = 'PUT';
    options.url = `${config.api.baseUrl}/locations/${location.id}/`;
  } else {
    options.method = 'POST';
    options.url = `${config.api.baseUrl}/locations/`;
  }

  rp(options)
    .then(() => {
      if (location.id && location.id.length > 0) {
        req.flash('info', `Updated ${location.title}`);
      } else {
        req.flash('info', `Added ${location.title}`);
      }

      res.redirect('/locations');
    })
    .catch((error) => {
      req.errors =  error.response.body;
      edit(req, res);
    });

}

function edit(req, res) {

  res.locals.labels = labels;

  if (req.body && Object.keys(req.body).length > 0) {
    res.render('locations/edit', {
      section: 'locations',
      location: req.body,
      errors: req.errors
    });
    return;
  }

  if (!req.params.id) {
    res.render('locations/edit', {
      section: 'locations',
      errors: req.errors
    });
    return;
  }

  const options = {
    method: 'GET',
    url: `${config.api.baseUrl}/locations/${req.params.id}/`,
    headers: {
      'Authorization': `Bearer ${req.session.token}`,
      'content-type': 'application/json'
    },
    json: true
  };

  rp(options)
    .then((data) => {
      res.render('locations/edit', {
        section: 'locations',
        location: data,
        errors: req.errors
      });
    })
    .catch((error) => {
      res.render('error' , { error: error.error });
    });

}

function remove(req, res) {
  if (!req.params.id) {
    res.redirect('/locations');
  }

  const options = {
    method: 'DELETE',
    url: `${config.api.baseUrl}/locations/${req.params.id}/`,
    headers: {
      'Authorization': `Bearer ${req.session.token}`,
      'content-type': 'application/json'
    },
    json: true
  };

  rp(options)
    .then(() => {
      req.flash('info', 'Location deleted');
      res.redirect('/locations');
    })
    .catch((error) => {
      res.render('error' , { error: error.error });
    });

}


router.get('/', index);
router.get('/add', edit);
router.post('/add', update);
router.get('/:id', edit);
router.post('/:id', update);
router.get('/:id/remove', remove);


module.exports = { router, index, edit, remove };
