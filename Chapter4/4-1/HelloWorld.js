var http = require('http');

//执行回调之前node已经把请求头解析并封装成req对象
var server = http.createServer(function(req,res){
	//等价于res.end("<h1>Hello World!</h1>");
	res.write("<h1>Hello World!</h1>");
	res.end();
});

server.listen(3000);