
//下面我们来写一个简单的 promsie。Promise 的参数是函数 fn，把内部定义 resolve 方法作为参数传到 fn 中，调用 fn。当异步操作成功后会调用 resolve 方法，然后就会执行 then 中注册的回调函数。

function MePromise(fn){
	//需要一个成功时的回调函数
	var callback;
	//一个实例的方法，用来注册异步事件
	this.then=function(done){
		callback=done;
	}
	
	function resolve(){
		callback();
	}
	
	fn(resolve);
}
