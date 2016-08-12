'use strict';

const gulp = require('gulp');
const paths = require('../paths');
const config = require('../../config');

// This process starts a browser sync instance
// It allows any changes made to trigger building and linting and
// automatically show up in the browser in real time
// without having to restart the sever
gulp.task('browserSync', (done) => {
  const browserSync = require('browser-sync').create('bs-proxy');

  browserSync.init(null, {
    proxy: `http://localhost:${config.port}`,
    files: [`${paths.outputStyles}/*.css`, `${paths.outputJS}/*.js`],
    reloadDelay: 1000,
    port: 3001,
    open: false
  });
  done();
});
