//server.js
var httpd = require('http').createServer(handler);
var io = require('socket.io').listen(httpd);
var fs = require('fs');
httpd.listen(4000);

function handler(req, res) {
    fs.readFile(__dirname + '/socket-test.html',function(err, data) {
        if (err) {
            res.writeHead(500);
            return res.end('Error loading index.html');
        }
        res.writeHead(200);
        res.end(data);
    });
}
io.sockets.on('connection', function (socket) {  
    socket.on("clientMessage",function (content) {
       socket.emit("serverMessage","You said: "+content);
       socket.get("username",function(er,username){
            if(!username){
                username = socket.id;
            }            
            socket.broadcast.emit("serverMessage",username+" said: " + content);
       });
    });
    //
    socket.on("login",function(username){       
        socket.set("username",username,function(er){
            if(er){
                console.log(er);
                //throw er;
            }
            socket.emit("serverMessage","Current logged in as "+username);
            socket.broadcast.emit("serverMessage","User "+username+" logged in.");
        });
    });
    socket.on("error",function(err){
        console.log("on error::",err);
    });
    socket.emit("login");
});

//client html
<html>
<head>
<title>Socket.IO chat demo</title>
<style type="text/css">
	#input {
	width: 200px;
	}
	#messages {
	position: fixed;
	top: 40px;
	bottom: 8px;
	left: 8px;
	right: 8px;
	border: 1px solid #EEEEEE;
	padding: 8px;
}
</style>
</head>
<body>
	Your Message: 
	<input id="username" type="text" value="visitoer">
	<input type="text" id = "input">
	<div id="Message"></div>

	<script src="http://localhost:4000/socket.io/socket.io.js"></script>
	<script type="text/javascript">	
	var msgElement = document.getElementById("Message");
	var lastMsgElement = null;
	var addMessage = function(msg){
		var newMsgElement = document.createElement("div");
		var newMsgText = document.createTextNode(msg);
		newMsgElement.appendChild(newMsgText);
		msgElement.insertBefore(newMsgElement,lastMsgElement);
		lastMsgElement = newMsgElement;
	};
	var socket = io.connect('http://localhost:4000');
	socket.on("serverMessage",function(content){
		addMessage(content);
	});
	socket.on("login",function(){
		var username = document.getElementById("username").value;
		socket.emit("login",username );
	});
	var inputElement = document.getElementById("input");
	inputElement.onkeydown = function(keydownevent){
		if(keydownevent.keyCode === 13){
			socket.emit("clientMessage",inputElement.value);
			inputElement.value = "";
			return false;
		} else{
			return true;
		}
	}

</script>
</body>
</html>
