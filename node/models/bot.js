module.exports = function(config) {
    const sleep     = require('system-sleep');
    const Discord   = require('discord.io');
    const bot       = new Discord.Client({
    	token : config.apikey,
    	autorun : true
    });

    bot.on('ready', function() {
    	console.log('Logged in as %s - %s\n', bot.username, bot.id);
    	bot.getAccountSettings(function(err, res) {
    		if (!err) {

    		}
    	});
    });

    bot.on('disconnect', function(err, code) {
        console.error('The bot has disconnected (' + code + ') with error: ' + err);
        bot.connect();
    });

    bot.on('presence', function(user, userID, status, game, event) {
        if (game && game.name != null) {
            console.log(user + ' (' + userID + ') is now playing ' + game.name);

            /*bot.sendMessage({
                to : 369262099647692800,
                message : user + " is now playing " + game.name + "."
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

        function checkZero(int) {
            if (int < 0) {
                return 0;
            } else {
                return 1;
            }
        };

        if (userID != "369268526252425227") {
            if (message === "ping") {
                bot.sendMessage({
                    to : channelID,
                    message : "pong"
                });
            }
            // The bot says hello back to someone saying Hello Rusty.
            else if (checkZero(message.search(/^(hey|hello|hi)(,)? (bot|Rusty|Rusty-bot|<\@369268526252425227>)(\.|\!)?$/i))) {
                bot.sendMessage({
                    to : channelID,
                    message : "Hello, " + user + "."
                });
                sleep(1*1000);
                bot.sendMessage({
                    to : userID,
                    message : `Is there anything I can do to help you today, **${user}**?  If so, please type **help** for a list of commands.`
                });
            }
            // When the comment line starts with report in a channel or PM.
            else if (checkZero(message.search(/^(\!)?report /i))) {
                var userMessage = message.replace(/^(\!)?report /i, "");
                console.log("Their message: " + userMessage );
                bot.sendMessage({
                    to : 369262099647692800,
                    message : `**${user}** is reporting: "${userMessage}"`
                });
                bot.sendMessage({
                    to : userID,
                    message : `Thank you, **${user}**. Your report has been submitted.`
                });
            }
            // When the comment line starts with the word help in the
            // bots own channel.
            else if (checkZero(message.search(/^(\!)?help(\.|\!)?/i))) {
                bot.sendMessage({
                    to : userID,
                    message : `Please type the word **report** followed by space and then your comments to submit a report to the server admins and moderators.`
                });

            }
            // Respond to the 'fuck you' messages that get sent to the bot
            else if (checkZero(message.search(/(fuck)( you)? rusty(\.|\!)?$/i))) {
                bot.sendMessage({
                    to : channelID,
                    message : `You are awesome too, **${user}**.`
                });
            }
            // Any uncaptured message that goes to the bots channel.
            else if (channelID == "369368624894443521" && userID != "369268526252425227") {
                bot.sendMessage({
                    to : 341918947337306114,
                    message : `${user}: ${message}`
                });
            } else {
                // do nothing
            }
        }
    });

    bot.on('any', function(event) {
        if (event.t != null) {
            //console.log('The bot detected activity on event: ' + event.t);
            //console.log(event.d);
            //console.log('\n');
        }
    });
    //END Discord Bot

    return bot;
}
