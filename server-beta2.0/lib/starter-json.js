const address = require("address");
const figlet = require("figlet");
const clear = require("clear");
const fs = require("fs");

const conf = {
	"server":{
		host: address.ip(),
		port: 8000
	},
	"interface": address.interface(),
	"types":{
		"html": "text/html",
		"js": "text/javascript",
		"css": "text/css",
		"json": "application/json",
		"png": "image/png",
		"jpg": "image/jpg",
		"gif": "image/gif",
		"wav": "audio/wav",
		"mp4": "video/mp4",
		"woff": "application/font-woff",
		"ttf": "applicetion/font-ttf",
		"eot": "application/vnd.ms-fontobject",
		"otf": "application/font-otf",
		"svg": "application/image/svg+xml"
	}
};

const settings = {
	"start": false,
	"connect": "http",
	"ssl": false,
	"port": undefined,
	"logger_v1": true
};

fs.exists(__dirname + "/../conf.json",(exists) => {
	if(exists == true){}else{
		fs.writeFileSync(__dirname + "/../conf.json",JSON.stringify(conf));
	};
});
fs.writeFileSync(__dirname + "/../conf.json",JSON.stringify(conf));
fs.exists(__dirname + "/../settings.json",(exists) => {
	if(exists == true){}else{
		fs.writeFileSync(__dirname + "/../settings.json",JSON.stringify(settings));
	};
});

console.log("\x1b[36m" + figlet.textSync("start\nserver..."));
setTimeout(() => {clear()}, 5000);