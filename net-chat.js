var net = require('net');
var chatServer = net.createServer();
clientList = [];
/*
function broadcast(message, client) {
	for(var i=0;i<clientList.length;i+=1) {
	if(client !== clientList[i]) {
		clientList[i].write(client.name + " says " + message);
		}
	}
}*/
chatServer.on('connection', function(client) {
	client.name = client.remoteAddress + ':' + client.remotePort;
	client.write('Hi ' + client.name + '!\n');
	clientList.push(client);
	client.on('data', function(data) {
		//broadcast(data, client);
		var cleanlist = [];
		clientList.forEach(function(c){
			if(c !== client){
				if(c.writeable){
					c.write(client.name + " says " + data);
				} else{ //destory if not writeable, also add this client to remove list
					cleanlist.push(c);
					c.destroy();
				}
			}
		});
		//remove dead node
		cleanlist.forEach(function(r){
			clientList.splice(clientList.indexOf(r),1);	
		});
	});
	client.on("end",function(){
		clientList.splice(clientList.indexOf(client),1);
	});
});
chatServer.on("error",function(e){
	console.log("Server error:",e.message);
});
chatServer.on("close",function () {
	console.log("server closed");
});

chatServer.listen(9000);
