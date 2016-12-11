const axios = require('axios');
const winston = require('winston');
const BASE_URL = require('../../config').api.baseUrl;

function getLocation(token, locationId) {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/locations/${locationId}/`,
      { headers: {'Authorization': `Bearer ${token}`}})
      .then(({data}) => {
        return resolve(data);
      }, (error) => {
        //winston.error(error);
        return reject(error);
      });
  });
}

function getLocations(token) {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/locations/`,
      { headers: {'Authorization': `Bearer ${token}`}}
    )
    .then((response) => {
      winston.log(response);
      resolve(response.data.results);
    }, (error) => {
      winston.error(error);
      return reject(error);
    });
  });
}

function saveLocation(token, location) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: location
    };

    if (location.id && location.id.length > 0) {
      options.method = 'put';
      options.url = `${BASE_URL}/locations/${location.id}/`;
    } else {
      options.method = 'post';
      options.url = `${BASE_URL}/locations/`;
    }

    axios(options)
      .then(({data}) => {
        return resolve(data);
      }, (error) => {
        //winston.error(error);
        return reject(error);
      });
  });
}

function deleteLocation(token, location) {
  return axios.delete(`${BASE_URL}/locations/${location.id}/`,
    { headers: {'Authorization': `Bearer ${token}`}});

}

module.exports = { getLocation, getLocations, saveLocation, deleteLocation };
