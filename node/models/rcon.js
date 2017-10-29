module.exports = function(config) {
    //var moment  = require('moment'); // moment.js
    const sleep = require('system-sleep');
    var WebRcon = require('webrconjs'); // node.js only

    // Create a new client:
    var rcon = new WebRcon(config.rcon.ip, config.rcon.port);
    var RustRcon = {
        _this : this,
        IndexVar : 1000,
        PlayerList : {},
        Callbacks : {},
        Request : function(cmd, callback) {
            this.IndexVar++;
            this.Callbacks[this.IndexVar] = {
                callback : callback
            }

            rcon.run(cmd, this.IndexVar);
        },
        GetPlayers : function(cb) {
            this.Request('playerlist', function(msg) {
                if (msg) {
                    var playerlist = fromJson(msg.message);
                    RustRcon.PlayerList = playerlist;
                    if (playerlist) {
                        if (typeof cb === 'function' && cb) {
                            RconConsole('The playerlist was retrieved via callback.');
                            cb(playerlist);
                        }
                        RconConsole('The playerlist was retrieved via return value.');
                        return playerlist;
                    } else {
                        RconConsole('The playerlist retrieval failed.');
                        return {};
                    }
                } else {
                    console.log(`Got something else: ${msg}`);
                    return {};
                }
            });
        },
    }

    const RconConsole = function(message) {
        console.log('\x1b[38;2;208;55;36mRcon:    %s\x1b[0m', message);
    }

    const fromJson = function(json) {
        return typeof json === 'string' ? JSON.parse(json) : json;
    }

    const checkZero = function(int) {
        if (int < 0) {
            return 0;
        } else {
            return 1;
        }
    }

    /* playerlist json
    [
      {
        "SteamID": "76561198303140036",
        "OwnerSteamID": "0",
        "DisplayName": "Brax ✪",
        "Ping": 40,
        "Address": "24.187.38.14:49699",
        "ConnectedSeconds": 2635,
        "VoiationLevel": 0.0,
        "CurrentLevel": 0.0,
        "UnspentXp": 0.0,
        "Health": 100.0
      }
    ]
    */

    // Handle events:
    rcon.on('connect', function() {
      RconConsole('Connected to the server.');
      RustRcon.GetPlayers();
    });

    rcon.on('disconnect', function() {
      RconConsole('Disconnected from the server.');
      RustRcon.IndexVar = 1000;
      RustRcon.Callbacks = {};
      RustRcon.PlayerList = {};
      sleep(1*5000);
      rcon.connect(config.rcon.password);
    });

    rcon.on('message', function(msg) {
        try {
            var data = fromJson(msg);

            if (data.identity > 1000) {
                var cb = RustRcon.Callbacks[data.identity];
                if (cb != null) {
                    cb.callback(data);
                }
            }
        } catch(e) {
            RconConsole(`Rcon: ERROR: ${e}`);
        }
      //logJson(msg);
      //console.log('MESSAGE:', msg);
    });

    rcon.on('error', function(err) {
        RconConsole(`Rcon: ERROR: ${err}`);
    });

    // Connect by providing the server's rcon.password:
    rcon.connect(config.rcon.password);

    return RustRcon;
}
