'use strict';

const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const nunjucks = require('express-nunjucks');
const session = require('express-session');
const flash = require('express-flash');


const config = require('./config');
const filters = require('./app/lib/nunjuckfilters');
const customValidators = require('./app/lib/validators');
const customSanitizers = require('./app/lib/sanitizers');

const indexController = require('./app/controller/indexcontroller');
const loginController = require('./app/controller/logincontroller');
const locationsController = require('./app/controller/locationscontroller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator({ customValidators, customSanitizers }));
app.use(flash());
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


app.use(express.static(`${__dirname}/app/public`));
app.use(express.static(`${__dirname}/build`));
app.use(express.static(`${__dirname}/node_modules/bootstrap/dist`));
app.use('/js', express.static(`${__dirname}/node_modules/jquery/dist`));
app.use(express.static(`${__dirname}/node_modules/tether/dist`));
app.use('/fonts', express.static(`${__dirname}/node_modules/font-awesome/fonts`));

var sess = {
  secret: 'somethingsecret',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1); // trust first proxy
  sess.cookie.secure = true; // serve secure cookies
}

app.use(session(sess));
app.use(require(`${__dirname}/app/middleware/auth`));





// Insert usefull variables into response for all controllers
app.use(require(`${__dirname}/app/middleware/locals`));

app.get('/', indexController.get);

app.get('/login', loginController.get);
app.post('/login', loginController.post);
app.get('/logout', loginController.logout);
app.get('/error', (req, res) => {
  res.render('error');
});

app.use('/locations', locationsController.router);

app.listen(config.port);
