//类的构造器
function Watcher(watchDir,processedDir){
  this.watchDir = watchDir;
  this.processedDir = processedDir;
}
var events = require('events')
  , fs = require('fs')
  , util = require('util')
  , watchDir = './watch'
  , processedDir  = './done';

//让Watcher类继承EventEmitter
util.inherits(Watcher, events.EventEmitter);


Watcher.prototype.watch = function() { 
  var watcher = this;
  fs.readdir(this.watchDir, function(err, files) {
    if (err) throw err;
    //处理watch目录的所有文件
    for(index in files) {
      watcher.emit('process', files[index]); 
    }
  })
}

Watcher.prototype.start = function() { 
  var watcher = this;
  //fs模块的自带功能，监听文件变化
  fs.watchFile(watchDir, function() {
    watcher.watch();
  });
}


//启动监听
var watcher = new Watcher(watchDir, processedDir);

watcher.on('process', function process(file) {
  var watchFile      = this.watchDir + '/' + file;
  var processedFile  = this.processedDir + '/' + file.toLowerCase();
  //把文件重命名到目标文件
  fs.rename(watchFile, processedFile, function(err) {
    if (err) throw err;
  });
});


watcher.start();
