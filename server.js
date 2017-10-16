var express		= require('express'),
	app			= express(),
	bodyParser	= require('body-parser'),
	morgan		= require('morgan'),
	path		= require('path'),
    Discord     = require('discord.io');

var config		= require('./config');

//app.set("view engine", "vash");
// set up the app to handle CORS requests and grab POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(function (req,res,next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
	              Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// setup the static file directory to make pulling with angular easier
app.use(express.static(__dirname + '/public'));

// Discord Bot
var bot = new Discord.Client({
    token : config.apikey,
    autorun : true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('disconnect', function(err, code) {
    console.error('The bot has disconnected (' + code + ') with error: ' + err);
});

bot.on('presence', function(user, userID, status, game, event) {
    console.log(user + ' (' + userID + ') - ' + status + ', is playing' + game.name);

    if (game && game.name != null) {
        bot.sendMessage({
            to : 369262099647692800,
            message : user + " is currently " + status + " and playing " + game.name + "."
        });
    } else {
        bot.sendMessage({
            to : 369262099647692800,
            message : user + " is currently " + status + "."
        });
    }

});

bot.on('message', function(user, userID, channelID, message, event) {
    console.log('Message received from, ' + user + ' in channel ' + channelID + '.  Message: ' + message);

    if (message === "ping") {
        bot.sendMessage({
            to : channelID,
            message : "pong"
        });
    }
});

bot.on('any', function(event) {
    if (event.t != null) {
        console.log('The bot detected activity on event: ' + event.t);
        console.log(event.d);
        console.log('\n');
    }
});
//END Discord Bot

// route all requests to the angular index.html file
//var apiRoutes  = require('./node/routes/api')(app, express);
//app.use('/', apiRoutes);

/*app.get('*', function (req, res) {
	res.sendFile(path.join(__dirname + '/public/views/index.html'));
});*/

app.on('error', function (err) {
	console.log('An error occured:' + err );
});
// Start the server
app.listen(config.server.port);
console.log( 'The xenostruct.com API is listening on port: ' +
              config.server.port + "\x1b[31m!\x1b[0m");
