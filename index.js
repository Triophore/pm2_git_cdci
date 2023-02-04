const config = require("./config").config;
const pm2 = require('pm2')
var http = require('http')
const gitPullOrClone = require('git-pull-or-clone')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: config.webhook, secret: config.secret });

'use strict';

const Hapi = require('@hapi/hapi');

const init = async () => {

    const server = Hapi.server({
        port: config.port,
        host: 'localhost'
    });


    server.route({
        method: 'POST',
        path: "/",
        handler: function (request, h) {
            var payload = request.payload;
            if(payload.pusher.repository.full_name == "venusdharan/athena_server" ){
                gitPullOrClone(config.git_repo,config.git_path, (err) => {
                    if (err) return;
                    console.log('Pulling latest repo');
                    pm2.connect(function(err) {
            
                        console.log("Restarting process");
                
                        pm2.restart(config.pm2_id, (err, proc) => {
                            // Disconnects from PM2
                            //pm2.disconnect()
                        })
                
                    });
                })
            }
            return {
                status : true
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {
    
            return 'Hello World!';
        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();



console.log("Launching CD CI Tool");

console.table(config);

console.log("Listening to webhook on port ::"+ config.port)

