var events = require('events')
  , net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

channel.on('join', function(id, client) {
  //保存用户的client对象，以便程序向用户发送数据
  this.clients[id] = client; 
  this.subscriptions[id] = function(senderId, message) {
  	//忽略发出广播的用户
    if (id != senderId) { 
      this.clients[id].write(message);
    }
  }
  //添加一个专门针对当前用户的broadcast事件监听器
  this.on('broadcast', this.subscriptions[id]); 
});

channel.on('leave', function(id) { 
  channel.removeListener('broadcast', this.subscriptions[id]); 
  channel.emit('broadcast', id, id + " has left the chat.\n");
});

channel.on('shutdown', function() {
  channel.emit('broadcast', '', "Chat has shut down.\n");
  channel.removeAllListeners('broadcast');
});

var server = net.createServer(function (client) {
  var id = client.remoteAddress + ':' + client.remotePort;
  //当有用户连接上了时发出一个join事件
  client.on('connect', function() {
    channel.emit('join', id, client); 
  });
  //当用户发送数据时发出一个广播
  client.on('data', function(data) {
    data = data.toString();
    //当有用户输入shutdown时关闭聊天
    if (data == "shutdown\r\n") {
      channel.emit('shutdown');
    }
    channel.emit('broadcast', id, data); 
  });
  //当用户断开连接是发出leave事件
  client.on('close', function() {
    channel.emit('leave', id); 
  });
});
server.listen(8888);
