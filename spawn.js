const config = require("./config").config;
var execSync = require('child_process').execSync;
var fs = require("fs");


child.execSync(config + "cd_start.sh");


try {
    const cmd = config + "cd_start.sh";
    var res = execSync(cmd).toString();
    var file_name = "log/POST"+ Date.now() + ".txt";
    fs.appendFileSync(file_name,res);
    fs.appendFileSync(file_name,"\n");
 } catch (error) {
    error.status;  // 0 : successful exit, but here in exception it has to be greater than 0
    error.message; // Holds the message you typically want.
    error.stderr;  // Holds the stderr output. Use `.toString()`.
    error.stdout;  // Holds the stdout output. Use `.toString()`.
 }