const knex = require('../db/knex')

function Conferences () {
  return knex('conferences')
}

function getConference (conferenceId) {
  return Conferences().where('id', conferenceId).first()
}

function getConferences () {
  return Conferences().select()
}

function addConference (conference) {
  return Conferences()
    .insert(conference, 'id')
    .then((result) => {
      return result[0]
    })
}

function updateConference (id, conference) {
  return Conferences().where('id', id).update(conference)
}

function deleteConference (id) {
  return Conferences().where('id', id).del()
}

module.exports = { getConference, getConferences, addConference, deleteConference, updateConference }
