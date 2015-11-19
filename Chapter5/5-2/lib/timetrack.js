var qs = require('querystring');

exports.sendHtml = function(res,html){
	res.setHeader('Content-Type','text/html');
	res.setHeader('Content-Length',Buffer.byteLength(html));
	res.end(html);
}
