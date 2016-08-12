'use strict';

const port = process.env.PORT || 3000;

module.exports = {
  env: process.env.NODE_ENV,
  port: port,
  api_url: process.env.API_URL
};
