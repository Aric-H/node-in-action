var http = require('http');
var qs = require('querystring');
var items = [];

var server = http.createServer(function(req,res){
	if('/'==req.url){
		switch(req.method){
			case 'GET':
				show(res);
				break;
			case 'POST':
				add(req,res);
				break;
			default:
				badRequest(res);
		}
	}else{
		notFound(res);
	}
})

function notFound(res){
	res.statusCode = 404;
	res.end('Not found');
}

function show(res){
	var html = '<html><head><title>Todo list</title></head>'
				+'<body>'
				+'<h1>Todo List</h1>'
				+'<ul>'
				+items.map(function(item){
					return '<li>'+item.toString();+'<li>';
				}).join('')
				+'</ul>'
				+'<form method="post" action="/">'
				+'<p><input type="text" name="item"/></p>'
				+'<p><input type="submit" value="提交"/></p>'
				+'</form>'
				+'</body>'
				+'</html>';
	res.statusCode = 200;
	res.setHeader('Content-Type','text/html;charset=utf-8');
	res.setHeader('Content-Length',Buffer.byteLength(html));
	res.end(html);
}

function badRequest(res){
	res.statusCode = 400;
	res.end('Bad Request');
}

function add(req,res){
	var body = '';
	//设置编码可以把传进来的数据块自动转化为字符串
	req.setEncoding('utf-8');
	req.on('data',function(chunk){
		body+=chunk;
	});
	req.on('end',function(){
		console.log(body);
		var obj = qs.parse(body);
		items.push(obj.item);
		show(res);
	})
}

server.listen(3000);