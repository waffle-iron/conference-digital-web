const express = require('express')
const winston = require('winston')
const Q = require('q')
const conferenceRepository = require('../repository/conferencerepository')
const locationRepository = require('../repository/locationrepository')
const router = express.Router()
const labels = {
  title: 'Conference name',
  description: 'Description',
  location: 'Location',
  organiser: 'Oganiser',
  date: 'Date'
}

function index (req, res, next) {
  conferenceRepository.getConferences()
    .then((conferences) => {
      res.render('conferences/index', {
        conferences
      })
    }, (error) => {
      winston.error(error)
      next(error)
    })
}

function update (req, res) {
  const conference = req.body

  conferenceRepository.saveConference(req.session.token, conference)
    .then(() => {
      if (conference.id && conference.id.length > 0) {
        req.flash('info', `Updated ${conference.title}`)
      } else {
        req.flash('info', `Added ${conference.title}`)
      }
      res.redirect('/conferences')
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
      let conference
      if (req.body && req.body.length > 0) {
        conference = req.body
      } else if (req.params.id && req.params.id.length > 0) {
        conference = yield conferenceRepository.getConference(req.params.id)
      } else {
        conference = {}
      }

      const locations = yield locationRepository.getLocations()

      res.render('conferences/edit', {
        conference,
        locations,
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
    res.redirect('/conferences')
  }

  conferenceRepository.deleteConference(req.session.token, {id: req.params.id})
    .then(() => {
      req.flash('info', 'Confernce deleted')
      res.redirect('/conferences')
    }, (error) => {
      next(error)
    })
}

function common (req, res, next) {
  res.locals.section = 'conferences'
  next()
}

router.get('/*', common)
router.get('/', index)
router.get(['/new', '/:id/edit'], edit)
router.post(['/new', '/:id/edit'], update)
router.get('/:id/remove', remove)

module.exports = { router, index, edit, remove }
