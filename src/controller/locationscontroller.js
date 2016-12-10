'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../../config');

const router = express.Router();
const labels = {
  title: 'Location name',
  description: 'Description',
  address_1: 'Address',
  address_2: 'Address 2',
  address_town: 'Town',
  address_county: 'County',
  address_country: 'Country',
  zipcode: 'Postcode/Zipcode '
};

function index(req, res) {
  axios.get(`${config.api.baseUrl}/locations/`,
    {
      headers: {'Authorization': `Bearer ${req.session.token}`}
    })
    .then(({data}) => {
      res.render('locations/index', {
        section: 'locations',
        locations: data.results
      });
    }, (error) => {
      console.log(error);
      res.render('error');
    });
}

function update(req, res) {
  // get the form data
  const location = req.body;

  const options = {
    headers: {
      'Authorization': `Bearer ${req.session.token}`
    },
    data: location
  };

  if (location.id && location.id.length > 0) {
    options.method = 'put';
    options.url = `${config.api.baseUrl}/locations/${location.id}/`;
  } else {
    options.method = 'post';
    options.url = `${config.api.baseUrl}/locations/`;
  }

  axios(options)
    .then(() => {
      if (location.id && location.id.length > 0) {
        req.flash('info', `Updated ${location.title}`);
      } else {
        req.flash('info', `Added ${location.title}`);
      }
      res.redirect('/locations');
    }, (error) => {
      console.log(error);
      if (error.data) {
        req.errors = error.data;
        return edit(req, res);
      } else {
        return res.render('error');
      }
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

  axios.get(`${config.api.baseUrl}/locations/${req.params.id}/`,
    {
      headers: {'Authorization': `Bearer ${req.session.token}`}
    })
    .then(({data}) => {
      res.render('locations/edit', {
        section: 'locations',
        location: data,
        errors: req.errors
      });
    })
    .catch((error) => {
      console.log(error);
      res.render('error');
    });

}

function remove(req, res) {
  if (!req.params.id) {
    res.redirect('/locations');
  }

  axios.delete(`${config.api.baseUrl}/locations/${req.params.id}/`,
    {
      headers: {'Authorization': `Bearer ${req.session.token}`}
    })
    .then(() => {
      req.flash('info', 'Location deleted');
      res.redirect('/locations');
    }, (error) => {
      console.log(error);
      res.render('error');
    });
}


router.get('/', index);
router.get('/add', edit);
router.post('/add', update);
router.get('/:id', edit);
router.post('/:id', update);
router.get('/:id/remove', remove);


module.exports = { router, index, edit, remove };
