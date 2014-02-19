;(function(namespace){
	//lets make the model singleton with a flag.
	var singleton;

	var Model = function(){	
		var page_url = "https://graph.facebook.com/search?type=page&&access_token=",
			page_details = "https://graph.facebook.com/",
			scriptId = "jsonpscript",
			spanIcon = document.getElementById("search-icon"),
			className = "loading";

		var request = function(src){
			var _this = this,
				script,
				scriptElem = document.getElementById(scriptId);
			if(!!scriptElem) {
				document.getElementsByTagName('head')[0].removeChild(scriptElem);
			}
			//show the loader as it is about to fire the request
			spanIcon.className = className;
			script = document.createElement('script');
			script.setAttribute('type', 'text/javascript');
			script.setAttribute('id', scriptId);
			script.setAttribute('src', src);
			script.async = true;
			/**
				script.onload does not work in case of IE for that we have to implement script.onreadystatechange.
			*/
			script.onload = function () {
        		//script is ready so hide the loader 
        		spanIcon.className = "";
		    };

			document.getElementsByTagName('head')[0].appendChild(script);
		};

		this.init = function(){			
			namespace.eventManager.listen("paintData", function(data){
				var url = page_url+"&q="+data.value+"&access_token="+namespace.config.access_token+"&callback="+data.callback;
				request(url);
			});
			namespace.eventManager.listen("paintDetails", function(data){
				var url = page_details+data.value+"?callback="+data.callback+"&fields=picture,name,about,likes,description";
				request(url);
			});
		};
	};

	if(!singleton) {
		singleton = new Model();
	}
	namespace.modelObj = singleton;
})(FbApp);