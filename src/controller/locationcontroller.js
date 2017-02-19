const express = require('express')
const winston = require('winston')
const Q = require('q')
const locationRepository = require('../repository/locationrepository')
const router = express.Router()
const labels = {
  title: 'Location name',
  description: 'Description',
  address_1: 'Address',
  address_2: 'Address 2',
  address_town: 'Town',
  address_county: 'County',
  address_country: 'Country',
  zipcode: 'Postcode/Zipcode'
}

function index (req, res, next) {
  locationRepository.getLocations()
    .then((locations) => {
      res.render('locations/index', {
        locations
      })
    }, (error) => {
      winston.error(error)
      next(error)
    })
}

function update (req, res) {
  const location = req.body

  locationRepository.saveLocation(req.session.token, location)
    .then(() => {
      if (location.id && location.id.length > 0) {
        req.flash('info', `Updated ${location.title}`)
      } else {
        req.flash('info', `Added ${location.title}`)
      }
      res.redirect('/locations')
    }, (error) => {
      if (error.data) {
        req.errors = error.data
        return edit(req, res)
      } else {
        return res.render('error')
      }
    })
}

function edit (req, res, next) {
  Q.spawn(function *main () {
    try {
      let location
      if (req.body && req.body.length > 0) {
        location = req.body
      } else if (req.params.id && req.params.id.length > 0) {
        location = yield locationRepository.getLocation(req.params.id)
      } else {
        location = {}
      }

      res.render('locations/edit', {
        location,
        errors: req.errors,
        labels
      })
    } catch (error) {
      next(error)
    }
  })
}

function remove (req, res, next) {
  if (!req.params.id) {
    res.redirect('/locations')
  }

  locationRepository.deleteLocation(req.session.token, {id: req.params.id})
    .then(() => {
      req.flash('info', 'Location deleted')
      res.redirect('/locations')
    }, (error) => {
      next(error)
    })
}

function common (req, res, next) {
  res.locals.section = 'locations'
  next()
}

router.get('/*', common)
router.get('/', index)
router.get(['/new', '/:id/edit'], edit)
router.post(['/new', '/:id/edit'], update)
router.get('/:id/remove', remove)

module.exports = { router, index, edit, remove }
