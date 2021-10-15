const wget = require("node-wget");
wget("https://github.com/maksim990/https-server/archive/refs/heads/main.zip");


const fs = require("fs");

var DecompressZip = require('decompress-zip');
var unzipper = new DecompressZip("./main.zip");

unzipper.on('error', function (err) {
    console.log('Caught an error' + err.stack);
});

unzipper.on('extract', function (log) {
    console.log('Finished extracting' + log);
});

unzipper.on('progress', function (fileIndex, fileCount) {
    console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
});

unzipper.extract({
    path: './g',
    filter: function (file) {
        return file.type !== "SymbolicLink";
    }
});