module.exports = function(app, express, bot, form, rcon, config) {
    var apiRouter = express.Router();
    var request   = require('request');
    //const util = require('util')

    //app.use(express.static(__dirname + '/public'));

    apiRouter.get('/', function(req, res) {
        /*res.json({
            title : "Xenostruct API " + config.version,
            message : "No API informaton at this time."
        });*/
        //res.sendFile('/');
        console.log('/players');
        try {
            //rcon.GetPlayers(function(response) {
                res.render('index', {
                    status  : rcon.Status,
                    players : response
                });
            //});
        } catch(e) {
            console.log('API ERROR: %s', e);
            res.render('index', {
                status  : rcon.Status,
                players : {}
            });
        }
    });

    apiRouter.post('/',
            form( form.field("reporter").trim().required(),
                form.field("reported").trim().required(),
                form.field("message").trim().required()),
            function (req, res)
            {
            var userReporting   = req.form.reporter || false;
            var userReported    = req.form.reported || false;
            var message         = req.form.message || false;
            var captcha         = req.body['g-recaptcha-response'] || false;

            if (userReporting && userReported && message) {
                if (captcha) {
                    let remoteip = req.connection.remoteAddress || null
                    let validationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + config.recapt + "&response=" + captcha + "&remoteip=" + remoteip;

                    request(validationURL, function(error, response, body) {
                        body = JSON.parse(body);
                        if (body.success !== undefined && !body.success) {
                            return res.json({
                                success : false,
                                data	: {},
                                message : 'Captcha verification failed.'
                            });
                        } else {
                            bot.sendMessage({
                                to : 369262099647692800,
                                message : "**" + userReporting + "** is reporting **" +
                                    userReported + "** for, \"" + message + "\""
                            });

                            res.sendFile(config.projectDir + '/public/views/form-complaint.html');
                        }
                    })
                } else {
                    return res.json({
                        success : false,
                        data	: {},
                        message : 'The captcha is required!'
                    });
                }
            } else {
                console.log("Invalid form submitted from POST /complaint.");
                console.log(`User reporting: ${userReporting}`);
                console.log(`User reported: ${userReported}`);
                console.log(`Message: ${message}`);
                console.log('\n');

                res.json({
                    success : false,
                    data	: {},
                    message : 'Please fill in all of the required fields.'
                });
            }
        });

    apiRouter.get('/complaint', function (req, res) {
        /*bot.sendMessage({
            to : 369262099647692800,
            message : "Test message from visiting the API."
        });*/

        res.json({
            title : "Xenostruct API " + config.version,
            message : "You have reached the player reporting API path."
        });
    });

    apiRouter.get('/players', function (req, res) {
        try {
            rcon.GetPlayers(function(response) {
                res.json({
                    title : "Xenostruct API " + config.version,
                    count : response.length,
                    message : response
                });
            });
        } catch (e) {
            res.json({
                title : "Xenostruct API " + config.version,
                message : e
            });
        }
    });

    return apiRouter;
}
