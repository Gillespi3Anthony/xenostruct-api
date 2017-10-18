var express		= require('express'),
	app			= express(),
	bodyParser	= require('body-parser'),
	morgan		= require('morgan'),
	path		= require('path'),
    form        = require('express-form'),
    field       = form.field;

const Discord   = require('discord.io');

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
const bot = new Discord.Client({
    token : config.apikey,
    autorun : true
});

bot.on('ready', function() {
    console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('disconnect', function(err, code) {
    console.error('The bot has disconnected (' + code + ') with error: ' + err);
    bot.connect();
});

bot.on('presence', function(user, userID, status, game, event) {
    if (game && game.name != null) {
        console.log(user + ' (' + userID + ') is ' + status + ' playing ' + game.name);

        /*bot.sendMessage({
            to : 369262099647692800,
            message : user + " is now " + status + " playing " + game.name + "."
        });*/
    } else {
        console.log(user + ' (' + userID + ') is ' + status + '.');

        /*bot.sendMessage({
            to : 369262099647692800,
            message : user + " is now " + status + "."
        });*/
    }

});

bot.on('message', function(user, userID, channelID, message, event) {
    console.log('Message received from, ' + user + ' (' + userID + ') in channel ' + channelID + '.  Message: ' + message);

    var hello = message.search(/^(hey|hello|hi)(,)? (bot|Rusty|Rusty-bot)(\.)?$/i);
    //console.log("Message result: " + hello);
    function checkZero(int) {
        if (int < 0) {
            return 0;
        } else {
            return 1;
        }
    };

    if (message === "ping") {
        bot.sendMessage({
            to : channelID,
            message : "pong"
        });
    }
    else if (checkZero(hello) && userID != "369268526252425227") {
        bot.sendMessage({
            to : channelID,
            message : "Hello, " + user + "."
        });
    }

    //console.log(message.search(/hello/i) && userID != "369268526252425227");
    //console.log(checkZero(hello) && userID != "369268526252425227");
});

bot.on('any', function(event) {
    if (event.t != null) {
        //console.log('The bot detected activity on event: ' + event.t);
        //console.log(event.d);
        //console.log('\n');
    }
});
//END Discord Bot

// route all requests to the angular index.html file
var apiRoutes  = require('./node/routes/api')(app, express, bot, form);
app.use('/', apiRoutes);

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
