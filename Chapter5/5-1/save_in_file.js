var fs = require('fs');
var path = require('path');
//process.argv返回一个由命令的单词组成的数组,splice(2)截取数组第二个元素开始往后的元素
var args = process.argv.splice(2);
//去除第一个参数（命令）
var command = args.shift();
//合并剩余参数
var taskDescription = args.join(' ');
//process.cwd()获取当前目录的路径
var file = path.join(process.cwd(),'/.tasks');

switch(command){
	case 'list':
		listTasks(file);
		break;
	case 'add':
		addTask(file,taskDescription);
		break;
	default:
		//process.argv[0]就表示node.exe
		console.log('Usage:'+process.argv[0]+' list | add [taskDescription]');
}

//从文本文件中加载用JSON编码的数据
function loadOrInitializeTaskArray(file,cb){
	fs.exists(file,function(exists){
		if(exists){
			//如果文件存在,读取文件的任务,放进一个任务数组
			fs.readFile(file,'utf8',function(err,data){
				if(err) throw err;
				var data = data.toString();
				var tasks = JSON.parse(data);
				cb(tasks);
			})
		}else{
			//否则传一个空的任务数组
			cb([]);
		}
	})
}

function listTasks(file){
	//JS又一次通过传递函数的方式展示它的灵活性。loadOrInitializeTaskArray的cb参数就是一个函数
	loadOrInitializeTaskArray(file,function(tasks){
		for(var index in tasks){
			console.log(tasks[index]);
		}
	})
}

function storeTasks(file,tasks){
	//存储命令
	fs.writeFile(file,JSON.stringify(tasks),'utf8',function(err){
		if(err) throw err;
		console.log('Saved');
	})
}

function addTask(file,taskDescription){
	//如果是add命令,把add后面的命令添加到文件中
	loadOrInitializeTaskArray(file,function(tasks){
		tasks.push(taskDescription);
		storeTasks(file,tasks);
	})
}