require("./lib/starter-json.js");
const fs = require("fs");

try{
	var conf = require("./conf.json");
	var settings = require("./settings.json");
}catch(err){console.log("Произашел сбой модуля, попробуйте ещё раз"); return}

function start(){
	if(settings.start == false){
		console.log("Помощник по настройке файла settings.json\nвыбрать способ подключения http/https, в connect\nвыбрать свой сертификат false/true, в ssl\nлоггирование данных false/true, в logger_v1\n\nВНИМАНИЕ! Это сообщение появляется один раз");
		settings.start = true;
		fs.writeFileSync(__dirname + "/settings.json",JSON.stringify(settings));
		process.exit(1);
	};
}

function index(){
	if(settings.connect == "https"){
		require("./module/https.js");
	}else if(settings.connect == "http"){
		require("./module/http.js");
	}else{
		console.log("Невозможно определить запуск http/https");
		process.exit(1);
	}
}

if(settings.start == true){
	var on_start = index();
}else{
	var off_start = start();
}

on_start || off_start;