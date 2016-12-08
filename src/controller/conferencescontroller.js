'use strict';

const express = require('express');
const axios = require('axios');
const config = require('../../config');

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
  axios.get(`${config.api.baseUrl}/conferences/${req.params.id}/`,
    {
      headers: {'Authorization': `Bearer ${req.session.token}`}
    })
    .then(({data}) => {
      res.render('conferences/index', {
        section: 'conferences',
        conferences: data.results
      });
    }, (error) => {
      res.render('error', { error: error.error });
    });
}

function update(req, res) {
  // get the form data
  let conference = req.body;
  let options = {
    headers: {
      'Authorization': `Bearer ${req.session.token}`,
      'content-type': 'application/json'
    },
    data: conference
  };

  if (conference.id && conference.id.length > 0) {
    options.method = 'put';
    options.url = `${config.api.baseUrl}/conferences/${conference.id}/`;
  } else {
    options.method = 'post';
    options.url = `${config.api.baseUrl}/conferences/`;
  }

  axios(options)
    .then(() => {
      if (conference.id && conference.id.length > 0) {
        req.flash('info', `Updated ${conference.title}`);
      } else {
        req.flash('info', `Added ${conference.title}`);
      }

      res.redirect('/conferences');
    }, (error) => {
      req.errors = error.response.body;
      edit(req, res);
    });
}

function edit(req, res) {
  res.locals.labels = labels;
  if (req.body && Object.keys(req.body).length > 0) {
    res.render('conferences/edit', {
      section: 'conferences',
      conference: req.body,
      errors: req.errors
    });
    return;
  }
  if (!req.params.id) {
    res.render('conferences/edit', {
      section: 'conferences',
      errors: req.errors
    });
    return;
  }

  axios.get(`${config.api.baseUrl}/conferences/${req.params.id}/`,
    {
      headers: {'Authorization': `Bearer ${req.session.token}`}
    })
    .then(({data}) => {
      res.render('conferences/edit', {
        section: 'conferences',
        conference: data,
        errors: req.errors
      });
    }, (error) => {
      res.render('error', { error: error.error });
    });

}

function remove(req, res) {
  if (!req.params.id) {
    res.redirect('/conferences');
  }

  axios.delete(`${config.api.baseUrl}/conferences/${req.params.id}/`,
    {
      headers: {'Authorization': `Bearer ${req.session.token}`}
    })
    .then(() => {
      req.flash('info', 'Conference deleted');
      res.redirect('/conferences');
    }, (error) => {
      res.render('error', { error: error.error });
    });

}


router.get('/', index);
router.get('/add', edit);
router.post('/add', update);
router.get('/:id', edit);
router.post('/:id', update);
router.get('/:id/remove', remove);


module.exports = { router, index, edit, remove };
