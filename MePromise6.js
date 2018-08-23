
//失败处理
//异步操作不可能都成功，在异步操作失败时，标记其状态为 rejected，并执行注册的失败回调。
//有了之前处理 fulfilled 状态的经验，支持错误处理变得很容易。毫无疑问的是，在注册回调、处理状态变更上都要加入新的逻辑：
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
	}

	
	fn(resolve);
}



