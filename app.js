'use strict';

const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const nunjucks = require('express-nunjucks');

const config = require('./config');
const filters = require('./app/lib/nunjuckfilters');
const customValidators = require('./app/lib/validators');
const customSanitizers = require('./app/lib/sanitizers');

const indexController = require('./app/controller/indexcontroller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({ customValidators, customSanitizers }));

app.use(compression());

let nunjucksConfig = {
  autoescape: true
};

if (config.env !== 'production') {
  nunjucksConfig.noCache = true;
}

app.set('view engine', 'html');
app.set('views', [`${__dirname}/app/views`]);

nunjucks.setup(nunjucksConfig, app);

// Add extra filters to nunjucks
nunjucks.ready((nj) => {
  Object.keys(filters).forEach((filterName) => {
    nj.addFilter(filterName, filters[filterName]);
  });
});

// Insert usefull variables into response for all controllers
app.use(require(`${__dirname}/app/middleware/locals`));

app.use(express.static(`${__dirname}/app/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));


app.get('/', indexController.get);

app.listen(config.port);
