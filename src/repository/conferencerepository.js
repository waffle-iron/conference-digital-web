const axios = require('axios');
const winston = require('winston');
const BASE_URL = require('../../config').api.baseUrl;

function getConference(token, conferenceId) {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/conferences/${conferenceId}/`,
      { headers: {'Authorization': `Bearer ${token}`}})
      .then(({data}) => {
        return resolve(data);
      }, (error) => {
        //winston.error(error);
        return reject(error);
      });
  });
}

function getConferences(token) {
  return new Promise((resolve, reject) => {
    axios.get(`${BASE_URL}/conferences/`,
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

function saveConference(token, conference) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      data: conference
    };

    if (conference.id && conference.id.length > 0) {
      options.method = 'put';
      options.url = `${BASE_URL}/conferences/${conference.id}/`;
    } else {
      options.method = 'post';
      options.url = `${BASE_URL}/conferences/`;
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

function deleteConference(token, conference) {
  return axios.delete(`${BASE_URL}/conferences/${conference.id}/`,
    { headers: {'Authorization': `Bearer ${token}`}});

}

module.exports = { getConference, getConferences, saveConference, deleteConference };
