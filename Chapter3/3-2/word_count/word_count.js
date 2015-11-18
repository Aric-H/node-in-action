var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';

function checkIfComplete() {
  completedTasks++;
  if (completedTasks == tasks.length) {
    for(var index in wordCounts) { 
      //workCounts此时是对象,使用for...in...遍历对象index表示key
      console.log(index +': ' + wordCounts[index]);
    }
  }
}

function countWordsInText(text) {
  var words = text
    .toString()
    .toLowerCase()
    .split(/\W+/)
    .sort();
  for(var index in words) { 
    var word = words[index];
    if (word) {
      wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
    }
  }
}

//在回调函数中处理，是异步的，允许多个任务并行
fs.readdir(filesDir, function(err, files) { 
  if (err) throw err;
  for(var index in files) {
    var task = (function(file) { 
      //这里直接返回一个函数
      return function() {
        fs.readFile(file, function(err, text) {
          if (err) throw err;
          countWordsInText(text);
          checkIfComplete();
        });
      }
    })(filesDir + '/' + files[index]);
    //把返回的函数存在任务列表中
    tasks.push(task); 
  }
  for(var task in tasks) { 
    //执行任务列表的任务
    tasks[task]();
  }
});
