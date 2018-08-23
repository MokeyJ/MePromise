//完整代码
(function(window,undefined){
		//resolve和reject最终都会调用该函数
		var final=function(status,value){
			var promise=this,fn,st;
			
			if(promise._status!=='pending') return;
			
			//所有的执行都是异步调用，保证then是先执行的
			setTimeout(function(){
				promise._status=status;
				st=promise._status==='fulfilled';
				queue=promise[st ? '_resolves' : '_rejects'];
				
				while(fn =queue.shift()){
					value=fn.call(promise,value)||value;
				}
				
				promise[st ? '_value':'_reason']=value;
				promise['_resolves']=promise['_rejects']=undefined;
			},0);
		};
		
		//参数是一个函数，内部提供两个函数作为该函数的参数,分别是resolve 和 reject
		var MePromise=function(resolver){
			if(!(typeof resolver ==='function'))
			 throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
			//如果不是promise实例，就new一个
			if(!(this instanceof MePromise)) return new MePromise(resolver);
			
			var promise=this;
				promise._value;
				promise._reason;
				promise._status='pending';
			////存储状态
			promise._resolves=[];
			promise._rejects=[];
			
			
			var resolve=function (value){
				//由於apply參數是數組
				final.apply(promise,['fulfilled'].concat([value]));
			}
			
			var reject=function (reason){
				final.apply(promise,['rejected'].concat([reason]));
			}
			
			
			resolver(resolve,reject);
		}
		
		MePromise.prototype.then=function(onFulfilled,onRejected){
			var promise=this;
			
			//每次返回一个MePromise，保证是可thenable的
			return new MePromise(function(resolve,reject){
				function handle(value){
					//这一步很关键，只有这样才可以将值传递给下一个resolve
					var ret= typeof onFulfilled==='function'&& onFulfilled(value) ||value;
					//console.log(ret);
					//判断是不是promise 对象
					if(ret && typeof ret['then']=='function'){
						ret.then(function(value){
							resolve(value);
						},function (reason){
							reject(reason);
						});
					}else{
						resolve(ret);
					}
				}
				
				function errback(reason){
					reason= typeof onRejected ==='function' && onRejected(reason) || reason;
					reject(reason);
				}
				
				if(promise._status==='pending'){
					promise._resolves.push(handle);
					promise._rejects.push(errback);
				}else if(promise._status==='fulfilled'){ // 状态改变后的then操作，立刻执行
					callback(promise._value);
				}else if(promise._status==='rejected'){
					errback(promise._reason);
				}
			})
		}
		
		MePromise.prototype.catch=function(onRejected){
			return this.then(undefined,onRejected);
		};
		
		MePromise.prototype.delay =function(ms,value){
			return this.then(function(ori){
				return MePromise.delay(ms,value||ori);
			});
		}
		
		MePromise.delay=function(ms,value){
			return new MePromise(function(resolve,reject){
				setTimeout(function(){
					resolve(value);
					console.log('1');
				},ms)
			})
		};
		
		MePromise.resolve=function(arg){
			return new MePromise(function(resolve,reject){
				resolve(arg);
			})
		};
		
		MePromise.reject=function(arg){
			return new MePromise(function(resolve,reject){
				reject(arg);
			})
		};
		
		MePromise.all=function(promises){
			
			if(! Array.isArray(promises)){
				
				throw new TypeError('You must pass an array to all.');
			}
			
			
			return new MePromise(function(resolve,reject){
				var i=0,
					result=[],
					len=promises.length,
					count=len;
					
				//这里与race中的函数相比，多了一层嵌套，要传入index
				function resolver(index){
					return function(value){
						resolveAll(index,value);
					};
				};
				
				function rejector(reason){
					reject(reason);
				}
				
				function resolveAll(index,value){
					result[index]=value;
					if(--count==0){
						resolve(result);
					}
				};
				
				for( ; i<len; i++){
					promises[i].then(resolver(i),rejector);	
				}
			});
		};
		
		MePromise.race=function(promises){
			if(!Array.isArray(promises)){
				throw new TypeError('You must pass an array to race.');
			}
			
			return new MePromise(function(resolve,reject){
				var i=0,
					len=promises.length;
					
				function resolver(value){
					resolve(value);
				}
				
				function rejecter(reason){
					reject(reason);
				}
				
				for(;i<len;i++){
					promises[i].then(resolver,rejecter);
				}
			});
		};
		
		window.MePromise=MePromise;
	}
)(window);
