var qs = require('querystring');

exports.sendHtml = function(res,html){
	res.setHeader('Content-Type','text/html;charset=utf-8');
	res.setHeader('Content-Length',Buffer.byteLength(html));
	res.end(html);
}

//解析HTTP的POST请求,把接收的数据转换为对象
exports.parseReceivedData = function(req,cb){
	var body = '';
	req.setEncoding('utf8');
	req.on('data',function(chunk){
		body+=chunk;
	});
	req.on('end',function(){
		var data = qs.parse(body);
		cb(data);
	});
}

//渲染简单表单
exports.actionForm = function(id,path,label){
	var html = '<form action="'+path+'" method="POST">'
		+'<input type="hidden" name="id" value="'+id+'"/>'
		+'<input type="submit" value="'+label+'"/>'
		+'</form>'
	return html;
}

//添加工作记录
exports.add = function(db,req,res){
	exports.parseReceivedData(req,function(work){
		db.query(
			'INSERT INTO T_WORK (hours,date,description) values (?,?,?)',
			[work.hours,work.date,work.description],
			function(err){
				if(err) throw err;
				//显示未归档的工作记录
				exports.show(db,res);
			}
		)
	})
}

//删除工作记录
exports.delete = function(db,req,res){
	exports.parseReceivedData(req,function(work){
		db.query(
			'DELETE FROM T_WORK WHERE id = ?',
			[work.id],
			function(err){
				if(err) throw err;
				exports.show(db,res);
			}
		)
	})
}

//归档一条记录
exports.archive = function(db,req,res){
	exports.parseReceivedData(req,function(work){
		db.query(
			'UPDATE T_WORK SET archived = 1 WHERE id = ?',
			[work.id],
			function(err){
				if(err) throw err;
				exports.show(db,res);
			}
		)
	})
}

//基本的show函数
exports.show = function(db,res,showArchived){
	var query = "SELECT * FROM T_WORK WHERE archived = ? ORDER BY date DESC";
	var archiveValue = (showArchived) ? 1 : 0;
	db.query(
		query,
		//这个是替换占位符的查询条件
		[archiveValue],
		function(err,rows){
			if(err) throw err;
			var html = (showArchived) ? '' : '<a href="/archived">Archived work</a>';
			html+=exports.workHitlistHtml(rows); //将结果转化为html
			html+=exports.workFormHtml();
			exports.sendHtml(res,html);
		}
	);
};

//显示归档的工作记录
exports.showArchived = function(db,res){
	exports.show(db,res,true);
}

//将工作记录渲染为HTML表格
exports.workHitlistHtml = function(rows){
	var html = '<table style="border-collapse: collapse;border:1px dotted black;">'
		+'<tr>'
		+'<th style="border:1px dotted black;">工作日期</th>'
		+'<th style="border:1px dotted black;">工作时间</th>'
		+'<th style="border:1px dotted black;">工作内容</th>'
		+'<th colspan="2">操作</th></tr>';
	for(var index in rows){
		html+='<tr>';
		html+='<td style="border:1px dotted black;">'+rows[index].date+'</td>';
		html+='<td style="border:1px dotted black;">'+rows[index].hours+'</td>';
		html+='<td style="border:1px dotted black;">'+rows[index].description+'</td>';
		//还没有归档显示归档表单
		if(!rows[index].archived){
			html+='<td style="border:1px dotted black;">'+exports.workArchivedForm(rows[index].id)+'</td>';
		}
		//删除表单
		html+='<td style="border:1px dotted black;">'+exports.workDeleteForm(rows[index].id)+'</td>';
		html+='</tr>';
	}
	html+='</table>';
	return html;
}

//用来添加工作记录的HTML表单
exports.workFormHtml = function(){
	var html = '<form method="post" action="/">'
		+'<p>日期(yyyy-MM-dd):<br/><input type="date" name="date"/></p>'
		+'<p>工作时间:<br/><input name="hours" type="text"/></p>'
		+'<p>工作描述:<br/><textarea name="description"></textarea></p>'
		+'<p><input type="submit" value="添加"/></p>'
		+'</form>';
	return html;
}

//用来归档的工作记录表单
exports.workArchivedForm = function(id){
	return exports.actionForm(id,'/archive','归档');
}

//用来删除工作记录的表单
exports.workDeleteForm = function(id){
	return exports.actionForm(id,'/delete','删除');
}


