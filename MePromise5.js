
//串行Promise
//串行 Promise 是指在当前 promise 达到 fulfilled 状态后，即开始进行下一个 promise（后邻 promise）。例如我们先用ajax从后台获取用户的的数据，再根据该数据去获取其他数据。
//这里我们主要对 then 方法进行改造：

function MePromise(fn){
	var promise=this,
	    value=null,
	    promise._resolves=[]
	    promise._status='pending';
	
	/*this.then=function(onFulfilled){
		return new MePromise(function(resolve){
			function handle(value){
				var ret=isFunction(onFulfilled) && onFulfilled(value) || value;
				resolve(ret);
			}
			
			if(promise._status==='pending'){
				promise._resolves.push(handle);
			}else if(promise._status==='fulfilled'){
				handle(value);
			}
		})
		
	}; */
	
	this.then=function(onFulfilled){
		return new MePromise(function(resolve){
			function handle(value){
				var ret = typeof onFulfilled ==='function' && onFulfilled(value) || value;
				if(ret && typeof ret ['then']=='function'){
					ret.then(function(value){
						resolve(value);
					});
				}else {
					resolve(ret);
				}
			}
			
			if(promise._status==='pending'){
				promise._resolves.push(handle);
			}else if(promise._status==='fulfilled'){
				handle(value);
			}
		});
	}
	
	 function resolve(value){
	 	setTimeout(function(){
	 		promise._status='fulfilled';
	 		promise._resolves.forEach(function(callback){
	 			value=callback(value);
	 		})
	 	},0)
	 };

	
	fn(resolve);
}

 /*
  * 注意的是，new Promise() 中匿名函数中的 promise （promise._resolves 中的 promise）指向的都是上一个 promise 对象， 而不是当前这个刚刚创建的。

  * 首先我们返回的是新的一个promise对象，因为是同类型，所以链式仍然可以实现。

  * 其次，我们添加了一个 handle 函数，handle 函数对上一个 promise 的 then 中回调进行了处理，并且调用了当前的 promise 中的 resolve 方法。

  *  接着将 handle 函数添加到 上一个promise 的 promise._resolves 中，当异步操作成功后就会执行 handle 函数，这样就可以 执行 当前 promise 对象的回调方法。我们的目的就达到了。
  * 
  */
 
 /*
  * 首先我们创建了一个 Promise 实例，这里叫做 promise1；接着会运行 fn1(resolve);

	但是 fn1 中有一个 setTimeout 函数，于是就会先跳过这一部分，运行后面的第一个 then 方法;

	then 返回一个新的对象 promise2,  promise2 对象的 resolve 方法和 then 方法的中回调函数 fn2 都被封装在 handle 中， 然后 handle 被添加到 　　promise1._resolves 数组中。

	接着运行第二个 then 方法，同样返回一个新的对象 promise3, 包含 promise3 的 resolve 方法和 回调函数 fn3 的 handle 方法被添加到 promise2._resolves 数组中。

	到此两个 then 运行结束。 setTimeout 中的延迟时间一到，就会调用 promise1的 resolve方法。

	resolve 方法的执行，会调用 promise1._resolves 数组中的回调，之前我们添加的 handle 方法就会被执行； 也就是 fn2 和 promsie2 的 resolve 方法，都被调用了。

	以此类推，fn3 会和 promise3 的 resolve 方法 一起执行，因为后面没有 then 方法了，promise3._resolves 数组是空的 。

至此所有回调执行结束

 	但这里还存在一个问题，就是我们的 then 里面函数不能对 Promise 对象进行处理。这里我们需要再次对 then 进行修改，使其能够处理 promise 对象。
  */
 
 /*
  * 在 then 方法里面，我们对 ret 进行了判断，如果是一个 promise 对象，就会调用其 then 方法，形成一个嵌套，直到其不是promise对象为止。同时 在 then 方法中我们添加了调用 resolve 方法，这样链式得以维持。
  */


