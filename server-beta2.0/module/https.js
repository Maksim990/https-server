var settings = require("../settings.json");
var conf = require("../conf.json");
var https = require("https");
var path = require("path");
var fs = require("fs");

//search crt-pfx
if(settings.ssl == false){
    var ssl_off = {
        pfx: fs.readFileSync("./ssl/ssl-off.pfx"),
        passphrase: "password"
	};
}else{
	fs.exists(`./ssl/${conf["server"].host}.pfx`,(exists) => {
		if(exists == false){
			console.log("Ошибка сертифаката " + `ssl/${conf["server"].host}.pfx` + ", под ваш айпи адрес не найден!");
			process.exit(1);
		};
	});
	var ssl_on = {
		pfx: fs.writeFileSync(`./ssl/${conf.host}.pfx`,"utf8"),
		passphrase: ""
	};
	setTimeout(() => {
		if(!ssl_on.passphrase){
			console.log("Ошибка, требуется указать пароль от сертификата");
			process.exit(1);
		};
	}, 10);
}

var ssl = ssl_off || ssl_on;

function index(){
	try{
		//info stat
		console.log("Сервер запущен на https");
		console.log(`Локальный IP-Адрес: ${conf["interface"].address}`);
		var netmask;
		if(conf["interface"].netmask == "255.255.255.0") netmask = "Роутер";
		if(conf["interface"].netmask == "255.0.0.0") netmask = "Мобильный интернет";
		console.log(`Тип подключения: ${netmask}`);
		console.log(`Тип протокола: ${conf["interface"].family}`);
		console.log(`MAC-Адрес: ${conf["interface"].mac}\n`);
		
		//start server
		var server = https.createServer(ssl,(req,res) => {
			if(req.url == "" || req.url == "/"){
				req.url = "index.html";
			};
			if(settings.logger_v1 == true){
				fs.appendFile("./visit-site.log",`\n\n${JSON.stringify(req.headers)}`,(err) => {
					if(err) console.log("Произашел сбой логгирования, посещающих сайт");
				});
			};
			console.log("url: " + req.url.split("/")[req.url.split("/").length - 1]);
			fs.exists(__dirname + "/../../" + req.url.split("/")[req.url.split("/").length - 1],(exists) => {
				if(exists == true){
					fs.readFile(__dirname + "/../../" + req.url,(err,data) => {
						if(err) console.log(err.stack);
						res.writeHead(200, { "Content-Type": conf.types[path.extname(req.url).split(".")[1]]});
						res.write(data);
						res.end();
					});
				}else{
					res.writeHead(404, { "Content-Type": "text/html" });
					var url = `https://${conf["server"].host}:${conf["server"].port}/${req.url}`;
        		    res.end(`<!DOCTYPE html><head><meta charset='utf8'><title>404</title><style>*,html {margin: 0;padding: 0;border: 0;}html {width: 100%;height: 100%;}body {width: 100%;height: 100%;position: relative;background-color: rgb(236, 69, 42);}.code{ background-color: #333; padding: 1px 4px; }.center {width: 100%;height: 50%;margin: 0;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);color: white;font-family: 'Trebuchet MS', Helvetica, sans-serif;text-align: center;}h1 {font-size: 144px;}p {font-size: 64px;}</style></head><body><div class='center'><h1>Ошибка 404</h1><p>По вашему запросу <code>url:${url}</code><br/>нечего не найдено</p></div></body></html>`);
				}
			});
		});
		server.listen(conf["server"].port,conf["server"].host,() => {
			console.log(`Сервер запущен => https://${conf["server"].host}:8000`);
		});
	}catch(err){
		console.log("Произашла непредвиденная ошибка!");
		setTimeout(() => {
			console.log("Исправьте ошибку, прежде чем сможете запустить сервер\n" + err.stack);
			process.exit(1);
		}, 3800);
	}
}

setTimeout(() => {index()}, 5001);