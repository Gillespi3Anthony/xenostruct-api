let express		= require('express')
  , app			= express()
  , bodyParser	= require('body-parser')
  , morgan		= require('morgan')
  , path		= require('path')
  , form 		= require('express-form')
  , field       = form.field
  , index		= require('serve-index')
  , config		= require('./config');

config.projectDir = __dirname;

//app.set("view engine", "vash");
// set up the app to handle CORS requests and grab POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req,res,next) {
	res.setHeader('Access-Control-Allow-Origin', 'xenostruct.com');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	              Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// setup the static file directory
app.use(express.static(__dirname + '/public'));
app.use('/images',
	express.static('public/images'),
	index('public/images', {'icons': true}));
app.use('/videos',
	express.static('public/videos'),
	index('public/videos', {'icons': true}));

// Discord Bot
var bot = require('./node/models/bot.js')(config);

// route all requests to the angular index.html file
var apiRoutes  = require('./node/routes/api')(app, express, bot, form, config);
app.use('/', apiRoutes);

app.on('error', function (err) {
	console.log('An error occured:' + err );
});

// Start the server
app.listen(config.server.port);
console.log( 'The xenostruct.com API is listening on port: ' +
              config.server.port + "\x1b[31m!\x1b[0m");
