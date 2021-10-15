const settings = require("../settings.json");
const conf = require("../conf.json");
const address = require("address");
const http = require("http");
const path = require("path");
const fs = require("fs");

function index(){
	try{
		//info stat
		console.log("Сервер запущен на http");
		console.log(`Локальный IP-Адрес: ${conf["interface"].address}`);
		var netmask;
		if(conf["interface"].netmask == "255.255.255.0") netmask = "Роутер";
		if(conf["interface"].netmask == "255.0.0.0") netmask = "Мобильный интернет";
		console.log(`Тип подключения: ${netmask}`);
		console.log(`Тип протокола: ${conf["interface"].family}`);
		console.log(`MAC-Адрес: ${conf["interface"].mac}\n`);

		//start server
		var server = http.createServer(function(req,res){
			if(req.url == "" || req.url == "/"){
				req.url = "index.html";
			};
			if(settings.logger_v1 == true){
				fs.appendFile(__dirname + "/../visit-site.log", `\n\n${JSON.stringify(req.headers)}`,(err) => {
					if(err) console.log("Произашел сбой логгирования, посещяющих сайт");
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
					var url = `http://${conf["server"].host}:${conf["server"].port}/${req.url}`;
    		        res.end(`<!DOCTYPE html><head><meta charset='utf8'><title>404</title><style>*,html {margin: 0;padding: 0;border: 0;}html {width: 100%;height: 100%;}body {width: 100%;height: 100%;position: relative;background-color: rgb(236, 69, 42);}.code{ background-color: #333; padding: 1px 4px; }.center {width: 100%;height: 50%;margin: 0;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);color: white;font-family: 'Trebuchet MS', Helvetica, sans-serif;text-align: center;}h1 {font-size: 144px;}p {font-size: 64px;}</style></head><body><div class='center'><h1>Ошибка 404</h1><p>По вашему запросу <code>url:${url}</code><br/>нечего не найдено</p></div></body></html>`);
				}
			});
		});

		server.listen(conf["server"].port, conf["server"].host,() => {
		    console.log(`Сервер запущен => http://${conf["server"].host}:${conf["server"].port}`);
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