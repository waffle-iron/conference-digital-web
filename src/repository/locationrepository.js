const knex = require('../db/knex')

function Locations () {
  return knex('locations')
}

function getLocation (locationId) {
  return Locations().where('id', locationId).first()
}

function getLocations () {
  return Locations().select()
}

function addLocation (location) {
  return Locations()
    .insert(location, 'id')
    .then((result) => {
      return result[0]
    })
}

function updateLocation (id, location) {
  return Locations().where('id', id).update(location)
}

function deleteLocation (id) {
  return Locations().where('id', id).del()
}

module.exports = { getLocation, getLocations, addLocation, deleteLocation, updateLocation }
