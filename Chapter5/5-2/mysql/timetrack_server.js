//程序设置及数据库连接初始化
var http = require('http');
var work = require('./lib/timetrack.js');
var mysql = require('mysql');

//建表sql
var sql = 'CREATE TABLE IF NOT EXISTS T_WORK('
	+' id INT(10) PRIMARY KEY NOT NULL AUTO_INCREMENT,'
	+' hours DECIMAL(5,2) DEFAULT 0,'
	+' date DATE,'
	+' archived INT(1) DEFAULT 0,'
	+' description LONGTEXT)';

var db = mysql.createConnection({
	host:'127.0.0.1',
	user:'hj',
	password:'hejini123',
	database:'node'
});

var server = http.createServer(function(req,res){
	switch(req.method){
		case 'POST':
			switch(req.url){
				case '/':
					work.add(db,req,res);
					break;
				case '/archive':
					work.archive(db,req,res);
					break;
				case '/delete':
					work.delete(db,req,res);
					break;
			}
			break;
		case 'GET':
			switch(req.url){
				case '/':
					work.show(db,res);
					break;
				case '/archived':
					work.showArchived(db,res);
					break;
			}
			break;
	}
});

//程序运行时建数据表,如果没错误监听3000端口
db.query(sql,function(err){
	if(err) throw err;
	console.log('Server started...');
	server.listen(3000,'127.0.0.1');
})