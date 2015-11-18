var http = require('http'),
	parse = require('url').parse,
	join = require('path').join,
	fs = require('fs'),
	//__dirname在node中表示当前目录，所以在不同目录中有不同的值
	root = __dirname;

var server = http.createServer(function(req,res){
	var url = parse(req.url);
	var path = join(root,url.pathname);
	res.setHeader('Content-Type','text/plain;charset=utf-8');
	//fs的stat方法可以查看文件信息
	fs.stat(path,function(err,stat){
		if(err){
			if('ENOENT'==err.code){
				res.statusCode = 404;
				res.end('Not found');
			}else{
				res.statusCode = 500;
				res.end('Internal server error');
			}
		}else{
			res.setHeader('Content-Length',stat.size);
			var stream = fs.createReadStream(path);
			//res.end()会在stream.pipe()内部调用
			stream.pipe(res);
			stream.on('error',function(err){
				res.statusCode = 500;
				res.end('Internal server error');
			})
		}
	})
});

server.listen(3000);