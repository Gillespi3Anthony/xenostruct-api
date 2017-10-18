module.exports = function(app, express, bot, form) {
    var apiRouter = express.Router(),
        config    = require('../../config');

    apiRouter.get('/', function(req, res) {
        res.json({
            title : "Xenostruct API " + config.version,
            message : "No API informaton at this time."
        });
    });

    apiRouter.get('/complaint', function (req, res) {
            bot.sendMessage({
                to : 369262099647692800,
                message : "Test message from visiting the API."
            });

            res.json({
                title : "Xenostruct API " + config.version,
                message : "You have reached the player reporting API path."
            });
        });

    apiRouter.post('/complaint',
            form( form.field("reporter").trim().required(),
                form.field("reported").trim().required(),
                form.field("message").trim().required()),
            function (req, res)
            {
            var userReporting   = req.form.reporter || false;
            var userReported    = req.form.reported || false;
            var message         = req.form.message || false;
            //var formCheck       = req.body.xcheck || false;

            if (userReporting && userReported && message) {
                bot.sendMessage({
                    to : 369262099647692800,
                    message : "**" + userReporting + "** is reporting **" +
                        userReported + "** for, \"" + message + "\""
                });

                res.status(200).json({
                    success : true,
                    data	: {},
                    message : 'Message sent successfully!'
                });
            } else {
                console.log("Invalid form submitted from POST /complaint.");
                console.log(`User reporting: ${userReporting}`);
                console.log(`User reported: ${userReported}`);
                console.log(`Message: ${message}`);
                console.log('\n');

                res.status(404).json({
                    success : false,
                    data	: {},
                    message : 'Please fill in all of the required fields.'
                });
            }
        });

    return apiRouter;
}
