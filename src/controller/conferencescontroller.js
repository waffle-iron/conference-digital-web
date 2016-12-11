'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../../config');
const conferenceRepository = require('../repository/conferencerepository');

const router = express.Router();
const labels = {
  title: 'Conference name',
  description: 'Description',
  organiser: 'Organiser',
  location: 'Location',
  start_datetime: 'Start date/time',
  end_datetime: 'End date/time'
};

function index(req, res) {
  conferenceRepository.getConferences(req.session.token)
    .then((conferences) => {
      res.render('conferences/index', {
        section: 'conferences',
        conferences
      });
    }, (error) => {
      res.render('error');
    });
}

function update(req, res) {
  const conference = req.body;

  conferenceRepository.saveConference(req.session.token, conference)
    .then(() => {
      if (conference.id && conference.id.length > 0) {
        req.flash('info', `Updated ${conference.title}`);
      } else {
        req.flash('info', `Added ${conference.title}`);
      }
      res.redirect('/conferences');
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
  function render(conference) {
    res.render('conferences/edit', {
      section: 'conferences',
      conference,
      errors: req.errors,
      labels
    });
  }

  // if called with a req body, then this is a re-edit with errors
  // if we have an id then we are editing a conference
  // otherwise this is the first try to create a new conference
  if (req.body && req.body.length > 0) {
    return render(req.body);
  } else if (req.params.id) {
    return conferenceRepository.getConference(req.session.token, req.params.id)
      .then((conference) => {
        render(conference);
      }, (error) => {
        res.render('error');
      });
  }

  return render();
}

function remove(req, res) {
  if (!req.params.id) {
    res.redirect('/conferences');
  }

  conferenceRepository.deleteConference(req.session.token, {id: req.params.id})
    .then(() => {
      req.flash('info', 'Conference deleted');
      res.redirect('/conferences');
    }, (error) => {
      res.render('error');
    });
}


router.get('/', index);
router.get(['/new','/:id/edit'], edit);
router.post(['/new','/:id/edit'], update);
router.get('/:id/remove', remove);


module.exports = { router, index, edit, remove };
