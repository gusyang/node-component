var fs = require("fs");


//download file
//var http = require("http");

/*
http.createServer( function(req, res) {
	var rs = fs.createReadStream('./log/IM_DB_Design_Temp.doc');
	rs.on('data', function(data) {
		if (!res.write(data)) {
		rs.pause();
		}
	});
	res.on('drain', function() {
		rs.resume();
		});
	rs.on('end', function() {
		res.end();
		});
	rs.on("error",function  (er) {
		console.log("err>> ",er)
	});
}).listen(8080);
*/

//copy by stream
var filepath = "./log/IM_DB_Design_Temp.doc";
var read = fs.createReadStream(filepath);
var write = fs.createWriteStream("./des.doc");
var passleng = 0;
var lastSize = 0;
var totalSize = fs.statSync(filepath).size;
var startTime = Date.now();
read.on("data",function(chunk){
	passleng += chunk.length;
	if(write.write(chunk) === false){
		read.pause();
	}
});

read.on("end",function () {
	write.end();
});

write.on("drain",function () {
	read.resume();
});

setTimeout(function show(){
	var percent = Math.ceil((passleng / totalSize)*100);
	var size = Math.ceil(passleng / 1000000);
	var diff = size - lastSize;
	lastSize = size;
	//out.clearLine();
	//out.cursorTo(0);
	console.log("Finish " + size + " MB, " + percent + "%, Speed:" + diff * 2 + "MB/s");
	if(passleng < totalSize){
		setTimeOut(show(),500);
	} else{
		console.log("Time>>" + (Date.now() - startTime) / 1000 + "Second..");
	}
},500);
