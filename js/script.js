// console.log($)
// console.log(_)
// console.log(Backbone)

//api_key = "b6devysg94wdkfnin8lck4yb"

//https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}
//https://openapi.etsy.com/v2/listings/active?api_key=b6devysg94wdkfnin8lck4yb // working


var ItemModel = Backbone.Model.extend({

})


var MktCollection = Backbone.Collection.extend({	//collection of the marketing listing 
	model: ItemModel,
	url : "https://openapi.etsy.com/v2/listings/active.js",
	_key:"b6devysg94wdkfnin8lck4yb",


	parse: function(rawJSON){
		console.log("rawJSON", rawJSON, rawJSON.results)
		return rawJSON.results

	},

	initialize: function(){
		this.url = this.url + "?api_key=" + this._key + "&callback=?"	//url without pictures!!
		//"&callback=?" to let the browers know that is JSONP is the response data
	}

	

})



var MktView = Backbone.View.extend({
	el: "#container", //selector where the data will be render for the view 

	_buildTemplate: function(modelArr){
		var htmlStr = ""

		for(var i=0; i<modelArr.length; i++){
			console.log("modelArr", modelArr[i])
			var mArr = modelArr[i]
			// console.log("Model Arr", mArr)

			htmlStr += '<div id="itemListing">'
			htmlStr += 		'<p>' + mArr.get('title') + '</p>'
			htmlStr +=		'<img src="' + mArr.get('Images')[0].url_75x75 + '">'
			htmlStr +=		'<p>' + mArr.get('listing_id') + '</p>'
			htmlStr += 		'<p>' + "Price: $" + mArr.get('price') + '</p>'
			htmlStr +=		'<p>' + "Quantity: " + mArr.get('quantity') + '</p>'
			htmlStr += '</div>'	
		}

		return htmlStr

	}, 

	_render: function(){
		this.el.innerHTML = this._buildTemplate(this.mColl.models) 
		//the mColl from initialize is passed into the _render function when initalize function runs - models is the property from the mColl data 
	}, 

	initialize: function(mktColl){
		this.mColl = mktColl
		console.log(this.mColl)
	}


})




var MktRouter = Backbone.Router.extend({
	routes : {
		"listing/:listing_id" : "showItemView",
		"market" : "showMktView",
		"*default": "showMktView"
	},


	//to show mkt listing on the market page with the hash change
	showMktView: function(){

		var mktColl = new MktCollection()
		console.log("mktColl", mktColl)
		
		mktColl.fetch({
			data: {
				includes: 'Images,Shop',
			}
		}).then(function(d){
			var mView = new MktView(mktColl)	//going to have to define MktView!!!
			mView._render()
		})

	},

	initialize: function(){
		Backbone.history.start()
	}


})

new MktRouter()