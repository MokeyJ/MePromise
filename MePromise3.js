
//引入状态

function MePromise(fn){
	var promise=this,
	    value=null,
	    promise._resolves=[]
	    promise._status='pending';
	
	this.then=function(onFulfilled){
		if(promise._status==='pending'){
			promise._resolves.push(onFulfilled);
		
		    return this;
		}
		
		onFulfilled(value);
		return this;
		
	};
	
/*	function resolve(value){
		promise._resolves.forEach(function(callback){
			callback(value);
		});
};   */
	
	 function resolve(value){
	 	setTimeout(function(){
	 		promise._status='fulfilled';
	 		promise._resolves.forEach(function(callback){
	 			callback(value);
	 		})
	 	},0)
	 }

	
	fn(resolve);
}

 


