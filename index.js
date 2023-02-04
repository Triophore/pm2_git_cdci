const config = require("./config").config;
var http = require('http')
const gitPullOrClone = require('git-pull-or-clone')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: config.webhook, secret: config.secret });
const { spawn } = require('child_process');
const fs = require("fs")
'use strict';

const Hapi = require('@hapi/hapi');

var dir = './logs';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

const init = async () => {

    const server = Hapi.server({
        port: config.port,
        host: 'localhost'
    });


    server.route({
        method: 'POST',
        path: "/",
        handler: function (request, h) {
            var payload = JSON.parse(request.payload.payload);
            console.log(payload)
            if(payload.repository.full_name == "venusdharan/athena_server" ){
                console.log("Calling pulling script");
                const child = spawn('node', ["./spawn.js"], {
                    detached: true,
                    stdio: 'ignore'
                });
                  
                child.unref();
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

