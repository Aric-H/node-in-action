var http = require('http');

var server = http.createServer(function(req,res){
	var url = 'https://www.facebook.com';
	var body = '<p>Redirecting to <a href="'+url+'">'+url+'</a></p>';
	res.setHeader('Location',url);
	res.setHeader('Content-Length',body.length);
	res.statusCode = 302;
	res.end(body);
});
server.listen(3000);