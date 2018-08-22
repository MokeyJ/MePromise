
//下面加入链式，成功回调的方法就得变成数组才能存储。同时我们给 resolve 方法添加参数，这样就不会输出 undefined。

function MePromise(fn){
	var promise=this,
	    value=null,
	    promise._resolves=[];
	
	this.then=function(onFulfilled){
		promise._resolves.push(onFulfilled);
		
		return this;
	};
	
/*	function resolve(value){
		promise._resolves.forEach(function(callback){
			callback(value);
		});
	}; */
	
	 function resolve(value){
	 	setTimeout(function(){
	 		promise._resolves.forEach(function(callback){
	 			callback(value);
	 		})
	 	},0)
	 };
	
	fn(resolve);
}

/*
 1.  promise = this， 这样我们不用担心某个时刻 this 指向突然改变问题。

 2.	调用 then 方法，将回调放入 promise._resolves 队列；
	
 3.	创建 Promise 对象同时，调用其 fn, 并传入 resolve 方法，当 fn 的异步操作执行成功后，就会调用 resolve ，也就是执行promise._resolves 队列中的回调；
	
 4.	resolve 方法 接收一个参数，即异步操作返回的结果，方便传值。
	
 5. then方法中的 return this 实现了链式调用。
 
 	但是，目前的 Promise 还存在一些问题，如果我传入的是一个不包含异步操作的函数，resolve就会先于 then 执行，也就是说 promise._resolves 是一个空数组。
 * 
 * */

 // 为了解决这个问题，我们可以在 resolve 中添加 setTimeout，来将 resolve 中执行回调的逻辑放置到 JS 任务队列末尾。
 



