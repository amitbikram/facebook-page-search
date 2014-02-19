;(function(root, undefined){
	root.FbApp = root.FbApp || {};
	FbApp.config = {
		access_token: "CAAC14FHSMfABAJ81kbUMZAxytUeSwIAUNc10NQ5Co8yK6CbIgF12LZCabUjAVKmeSoEj3vzps8a5t7TxBfZCQcm5W0aFhueTvU2unCdHQqZC3jtxZAC6QnvPlFZABCsOliJM2FxTAvECQErI42rQdgn48jnRzlXnVYC7QdaPLuMMb5ZAMwzZC45r"
	};
	/**
	this is a simple implementation for pubsub library which is purely based on my requirement, can be customized according to the requirements.
	*/
	FbApp.eventManager = {
		data:{},
		raise: function(eventName, data){
			this.data[eventName].call(null, data);
		},
		listen: function(eventName, callback){
			this.data[eventName] = callback;
		}
	};
})(window);