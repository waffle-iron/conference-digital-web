'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../../config');
const locationRepository = require('../repository/locationrepository');

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
  locationRepository.getLocations(req.session.token)
    .then((locations) => {
      res.render('locations/index', {
        section: 'locations',
        locations
      });
    }, (error) => {
      res.render('error');
    });
}

function update(req, res) {
  const location = req.body;

  locationRepository.saveLocation(req.session.token, location)
    .then(() => {
      if (location.id && location.id.length > 0) {
        req.flash('info', `Updated ${location.title}`);
      } else {
        req.flash('info', `Added ${location.title}`);
      }
      res.redirect('/locations');
    }, (error) => {
      if (error.data) {
        req.errors = error.data;
        return edit(req, res);
      } else {
        return res.render('error');
      }
    });
}

function edit(req, res) {

  function render(location) {
    res.render('locations/edit', {
      section: 'locations',
      location,
      errors: req.errors,
      labels
    });
  }

  // if called with a req body, then this is a re-edit with errors
  // if we have an id then we are editing a location
  // otherwise this is the first try to create a new location
  if (req.body && req.body.length > 0) {
    return render(req.body);
  } else if (req.params.id) {
    return locationRepository.getLocation(req.session.token, req.params.id)
      .then((location) => {
        render(location);
      }, (error) => {
        res.render('error');
      });
  }

  return render();
}

function remove(req, res) {
  if (!req.params.id) {
    res.redirect('/locations');
  }

  locationRepository.deleteLocation(req.session.token, {id: req.params.id})
    .then(() => {
      req.flash('info', 'Location deleted');
      res.redirect('/locations');
    }, (error) => {
      res.render('error');
    });
}

// http://guides.rubyonrails.org/routing.html
router.get('/', index);
router.get(['/new','/:id/edit'], edit);
router.post(['/new','/:id/edit'], update);
router.get('/:id/remove', remove);


module.exports = { router, index, edit, remove };
