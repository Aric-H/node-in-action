function asyncFunction(callback){
	setTimeout(callback,200);
}

var color = 'blue';
//如果没有使用闭包那么输出会是green,因为延迟了两毫秒,但此时程序还是继续执行,2毫秒之后color变为green
//但闭包可以"冻结"color的值,传进来的color相当于一个局部变量,闭包外的值不会影响闭包内
(function(color){
	//传递回调函数
	asyncFunction(function(){
		console.log('The color is '+color);
	})
})(color)

color = 'green';