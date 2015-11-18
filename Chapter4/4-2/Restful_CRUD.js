var http = require('http');
var url = require('url');
var items = [];

var server = http.createServer(function(req,res){
	switch(req.method){
		case 'POST':
			var item = '';
			//设置了编码可以把数据块转换为字符串
			req.setEncoding('utf8');
			req.on('data',function(chunk){
				item+=chunk;
			});
			req.on('end',function(){
				items.push(item);
				res.end('OK\n');
			});
			break;
		case 'GET':
			//Array.map(callback(item,index))返回由数组中每个元素调用回调函数之后的新元素组成的数组
			var body = items.map(function(item,i){
				return i+")"+item;
			}).join('\n');
			//Node提供Buffer.byteLength方法获取字符串的字节长度。string.length获取的是字节长度
			res.setHeader('Content-Length',Buffer.byteLength(body));
			res.setHeader('Content-Type','text/plain;charset="utf-8"');
			res.end(body);
			break;
		case 'DELETE':
			//返回url的最后一个斜杠与参数之间的地址(包含斜杠)
			var path = url.parse(req.url),pathname;
			var i = parseInt(path.slice(1));
			if(isNaN(i)){
				//400表示客户端发起的请求不符合服务器对请求的某些限制，或者请求本身存在一定的错误
				res.statusCode = 400;
				res.end('Invalid item id');
			}else if(!items[i]){
				res.statusCode = 404;
				res.end('Item not found');
			}else{
				items.splice(i,1);
				res.statusCode = 200;
				res.end('ok\n');
			}
			break;
	}
});
server.listen(3000);