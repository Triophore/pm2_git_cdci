const config = require("./config").config;
const pm2 = require('pm2')
var http = require('http')
const gitPullOrClone = require('git-pull-or-clone')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: config.webhook, secret: config.secret });

http.createServer(function (req, res) {
    handler(req, res, function (err) {
      res.statusCode = 404
      res.end('no such location')
    })
}).listen(config.port)

handler.on('error', function (err) {
    console.error('Error:', err.message)
})
   
handler.on('push', function (event) {
    console.log('Received a push event for %s to %s',
      event.payload.repository.name,
      event.payload.ref)

    gitPullOrClone(config.git_repo,config.git_path, (err) => {
        if (err) return;
        console.log('SUCCESS!');
        pm2.connect(function(err) {

            console.log("Restarting process");
    
            pm2.restart(config.pm2_id, (err, proc) => {
                // Disconnects from PM2
                //pm2.disconnect()
            })
    
        });
    })

})

console.log("Launching CD CI Tool");

console.table(config);

console.log("Listening to webhook on port ::"+ config.port)

