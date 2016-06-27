//api_key = "b6devysg94wdkfnin8lck4yb"

//https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}
//https://openapi.etsy.com/v2/listings/active?api_key=b6devysg94wdkfnin8lck4yb // working



var MktCollection = Backbone.Collection.extend({	//collection of the marketing listing 
	model: ItemModel,
	url : "https://openapi.etsy.com/v2/listings/active.js",
	_key:"b6devysg94wdkfnin8lck4yb",
	parse: function(rawJSON){
		console.log(rawJSON.results)
		return rawJSON.results
	},
	
	initialize: function(params){
		if(params){
			this.url += "?api_key" + params
		}
	}

})

var ItemModel = Backbone.Model.extend({

})


var MktView = Backbone.View.extend({
	el: "container", //selector where the data will be render for the view 





})




var MktRouter = Backbone.Router.extend({
	routes : {
		"listing/:listing_id" : "showItemView",
		"market" : "showMktView",
		"*default": "showMktView"
	},


	showItemView: function(){

	},

	//to show mkt listing on the market page with the hash change
	showMktView: function(){
		var mktColl = new MktCollection()
	
		mktColl.fetch({
			dataType : "jsonp",
			data : {
				api_key:mktColl._key
			}
			.then(function(responseData){
				var mView = new MktView(MktCollection)	//going to have to define MktView!!!
				mView._render()
			})

			var appContainerEl = document.querySelector("#container"),

		})

	},

	goToMktHome: function(){
		location.hash = "market"
	},

	initialize: function(){
		Backbone.history.start()
	}


})

new MktRouter()