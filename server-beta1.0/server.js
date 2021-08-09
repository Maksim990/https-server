const colors = require("colors");
const address = require("address");
const https = require("https");
const path = require("path");
const fs = require("fs");
const options = {
    "ssl": {
        pfx: fs.readFileSync("ssl/192.168.31.165/server.pfx"),
        passphrase: "password"
    },
    "address": {
        ssl: "192.168.31.165",
        address: address.ip(),
        port: "2468"
    },
    "interface": {
        ifc: address.interface()
    }
};
const types = {    "css":"text/css",
    "html":"text/html",    "ico":"image/ico",
    "jpg":"image/jpeg",
    "js":"text/javascript",    "json":"application/json",
    "png":"image/png"
};var sslIP = options["address"].ssl;
var ssl = options["ssl"];
var addres = options["address"].address;
var port = options["address"].port;
//console.log(options["interface"].ifc);
if(addres == undefined){
    console.log(colors.bgRed("Ошибка неизвестный айпи адрес. Пожалуйста включитесь к мобильному интернету/роутеру".white));
};

console.log("Информация о подключении");
console.log("Айпи адрес:" + `${addres}`.yellow);
if(options["interface"].ifc.netmask == "255.0.0.0"){
    var mb_inet = "Мобильный интернет";
}else{
    var rt_inet = "Роутер";
}
console.log("Тип подключения:" + `${mb_inet || rt_inet}`.yellow);
console.log("Мак адрес:" + `${options["interface"].ifc.mac}\n`.yellow);

var server = https.createServer(ssl, function(request, response){
    if(request.url == "" || request.url == "/"){
        request.url = "index.html"
    };
    console.log(request);
    fs.readFile("../" + request.url, function(err,data){
        if(err){
            console.log("Error\n".red + `${err.stack}`.yellow);
        }else{
            response.writeHead(200, {"Content-Type":types[path.extname(request.url).split(".")[1]]});
            response.write(data);
        }
        response.end();
    });
});
server.listen(port, "0.0.0.0");server.listen(port, addres, function(){
    if(addres == sslIP){
        var block0;
    }else{
        console.log("ERR!".red + " Ошибка, айпи адрес не совпадает с сертификатом!");
    }
    console.log("Сервер запущен по адресу https://" + `${addres}:${port}`);
});