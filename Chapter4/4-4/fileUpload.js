var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function(req,res){
	switch(req.method){
		case 'GET':
			show(req,res,'');
			break;
		case 'POST':
			upload(req,res);
			break;
	}
});

function show(req,res,progress){
	var html = '<form action="/" method="post" enctype="multipart/form-data">'
				+'<p><input type="text" name="name"/></p>'
				+'<p><input type="file" name="file"/></p>'
				+'<p><input type="submit" value="提交"/></p>'
				+'<p>'+progress+'</p>'
				+"</form>";
	res.statusCode = 200;
	res.setHeader('Content-Type','text/html;charset=utf-8');
	res.setHeader('Content-Length',Buffer.byteLength(html));
	res.end(html);
}

function upload(req,res){
	//上传进度
	var progress;
	if(!isFormData(req)){
		res.statusCode = 400;
		res.end('Bad request:excepting multipart/form-data');
		return;
	}
	var form = new formidable.IncomingForm();
	//设置文件的接收目录,前提是有这个目录
	form.uploadDir = "./upload";
	form.parse(req);
	form.on('field',function(field,value){
		//表单中的文本字段
		console.log(field+":"+value);
	});
	form.on('file',function(name,file){
		//上传的文件信息
		console.log(name+":"+file);
	})
	form.on('end',function(){
		//上传完成
		res.setHeader('Content-Type','text/plain;charset=utf-8');
		res.end(progress);
	})
	form.on('progress',function(bytesReceived,bytesExpected){
		progress = '已上传'+Math.floor(bytesReceived/bytesExpected*100)+'%';
		console.log(progress);
	})
}

//判断MIME类型是不是mulltipart/form-data
function isFormData(req){
	var type = req.headers['content-type']+'';
	return 0 == type.indexOf('multipart/form-data');
}

server.listen(3000);