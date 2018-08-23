
//添加Promise.race方法
//该函数和 Promise.all 相类似，它同样接收一个数组，不同的是只要该数组中的任意一个 Promise 对象的状态发生变化（无论是 resolve 还是 reject）该方法都会返回。我们只需要对 Promise.all 方法稍加修改就可以了。
function MePromise(fn){
	var promise=this,
	    value=null,
	    promise._resolves=[],
	    promise._rejects=[],
	    promise._reason=null;
	    promise._status='pending';
	
	
	this.then=function(onFulfilled,onRejected){
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
			
			function errback(reason){
				reason=isFunction(onRejected) && onRejected(reason) || reason;
				
				reject(reason);
			}
			
			if(promise._status==='pending'){
				promise._resolves.push(handle);
				promise._rejects.push(errback);
			}else if(promise._status==='fulfilled'){
				handle(value);
			}else if(promise._status==='rejected'){
				errback(promise._reason);
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
	
	function reject(value){
		setTimeout(function(){
			promise._status='rejected';
			promise._rejects.forEach(function(callback){
				promise._reason=callback(value);
			})
		},0)
	};

	
	fn(resolve);
}


MePromise.all=function(promises){
	if(!Array.isArray(promises)){
		throw new TypeError('You must pass an array to race.');
	}
	
	//返回一个Promise实例
	return new MePromise(function(resolve,reject){
		var i=0,
			result=[],
			len=promises.length;
			
		function resolver(value){
			resolve(value);
		}
		
		function rejecter(reason){
			reject(reason);
		}
		
		
		// 依次循环执行每个promise
		for(;i<len;i++){
			// 若有一个失败，就执行rejecter函数 
			promises[i].then(resolver,rejecter);
		}
	});
}

 /*代码中没有类似一个 resolveAll 的函数，因为我们不需要等待所有的 promise 对象状态都发生变化，只要一个就可以了。 */


