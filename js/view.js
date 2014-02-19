;(function(namespace){
	namespace.View = function(){
		this.searchFieldId = "search_input";
		this.dataContainer = "data_container";

		this.init = function(){
			var _this = this,
				flag;
			/*
				I have only used addEventListener, we can create a facade of attach event 
				and put both addEventListener and attachEvent based on browser support.
			*/	
			document.getElementById(_this.searchFieldId).addEventListener("keyup", function(){
				var value = this.value;
				//using debounce to minimize jsonp request while typing.
				clearTimeout(flag); 
				flag = setTimeout(function(){
					var data = {
						value: value,
						callback: "FbApp.View.prototype.paintData"
					};
					namespace.eventManager.raise("paintData", data);
				},500);
			}, false);
			
			//using event delegation.
			document.getElementById(_this.dataContainer).addEventListener("click", function(e){
				e = e || event;  
				var target = e.target || e.srcElement;
				if (target.nodeName == 'A') {
					var data = {
						value: target.getAttribute("data-id"),
						callback: "FbApp.View.prototype.paintDetails"
					};
					namespace.eventManager.raise("paintDetails", data);
				}else{
					return;
				}
			}, false);
		};
	};
	
	namespace.View.prototype = {
		sortDesc: function(data){
			return data.sort(function(a,b){
			   if(a.name>b.name){
			     return -1
			   }
			   if(a.name<b.name){
			     return 1
			   }
			   return 0
			});
		}
		,addRow: function(row, category){
			var divElem = document.createElement('div');
			divElem.className = "each-row";
			divElem.id = "each_row_"+row.id;
			var anchor = document.createElement('a');
			anchor.setAttribute("data-id", row.id);
			anchor.setAttribute("href", "#"+row.id);
			anchor.innerHTML = row.name +"  ("+category+")";
			divElem.appendChild(anchor);
			return divElem;	
		}
		,paintData: function(response){
			var jsonData = this.sortDesc(response.data) || [],
				str = '',
				fragment = document.createDocumentFragment(),
				divElem;
				
			for(var i=0,len=jsonData.length; i<len; i++){
				var divElem = document.createElement('div');
				if(!!jsonData[i].category_list){
					for(var j=0, len1 = jsonData[i].length; j<len1; j++){
						divElem = this.addRow(jsonData[i][j], jsonData[i].category);
						fragment.appendChild(divElem);
					}
				}else{
					divElem = this.addRow(jsonData[i], jsonData[i].category);	
					fragment.appendChild(divElem);	
				}
			}
			document.getElementById("data_container").innerHTML = '';
			document.getElementById("data_container").appendChild(fragment);
		}
		,createElement: function(data, appendTo){
			var elem = document.createElement(data.elem);
			data.className? (elem.className = data.className):'';
			data.id? (elem.id = data.id):'';
			data.src? (elem.src = data.src):'';
			data.innerHTML? (elem.innerHTML = data.innerHTML):'';
			if (appendTo) {
				appendTo.appendChild(elem);
			}
			return elem;
		}
		,paintDetails: function(response){
			if(response.error){
				console.log("unable to fetch data");
				return;	
			}
			var fragment = document.createDocumentFragment();
			
			var divElem = this.createElement({
				elem: 'div',
				className: 'page-details',
				id: 'page_details_'+response.id
			});

			this.createElement({
				elem: 'img',
				src: response.picture.data.url||{}
			}, divElem);
			
			this.createElement({
				elem: 'div',
				className: 'page-about',
				innerHTML: response.about||''
			}, divElem);

			this.createElement({
				elem: 'div',
				className: 'page-description',
				innerHTML: response.description||''
			}, divElem);
			
			var divLike = this.createElement({
				elem: 'div',
				className: 'divLike'
			}, divElem);

			this.createElement({
				elem: 'span',
				innerHTML: (response.likes? response.likes:0)
			}, divLike);
			
			document.getElementById("page_details_"+response.id)? this.target.removeChild(document.getElementById("page_details_"+response.id)) :'';
			document.getElementById("each_row_"+response.id).appendChild(divElem);	
		}
	};
})(FbApp);