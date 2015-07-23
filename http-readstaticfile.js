var path = require("path"),
fs = require("fs");
//create http server
require("http").createServer(function(req,res){
	var file = path.normalize("." + req.url);
	console.log("trying to server",file);

	function reportError(e){
		console.log(e);
		res.writeHead(500);
		res.end("Internal Server Error");
	}

	fs.exists(file,function(exists){
		if(exists){
			fs.stat(file,function(err,stat){
				var rs;
				if(err){
					reportError(err);
				}
				if(stat.isDirectory()){
					res.writeHead(403);
					res.end("Forbidden brows directory..");
				} else{
					rs = fs.createReadStream(file);
					rs.on("error",reportError);
					res.writeHead(200);
					rs.pipe(res);
				}
			});
		} else {
			res.writeHead(404);
			res.end("Not found");
		}
	});
}).listen(8000);
