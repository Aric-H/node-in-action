var net = require('net');
var server = net.createServer(function(socket){
	//响应一次事件使用socket.once('data',handleData);
	socket.on('data',function(data){
		socket.write(data);
	})
});

server.listen(8888);
