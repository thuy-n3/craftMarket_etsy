// console.log($)
// console.log(_)
// console.log(Backbone)

//api_key = "b6devysg94wdkfnin8lck4yb"

//https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}
//https://openapi.etsy.com/v2/listings/active?api_key=b6devysg94wdkfnin8lck4yb // working

//listing# sample 269818178


var ItemModel = Backbone.Model.extend({
	url: function() {
		return "https://openapi.etsy.com/v2/listings/" + this.itemId + ".js"
	},

	_key:"b6devysg94wdkfnin8lck4yb",

	
	parse: function(rawJSON){
		console.log('parsed JSON')
		console.log(rawJSON.results[0])
		// console.log("rawJSON-SingleView", rawJSON, rawJSON.results[0])
		return rawJSON.results[0]
	},

	initialize: function(listingId){
		this.itemId = listingId
	}

})


var MktCollection = Backbone.Collection.extend({	//collection of the marketing listing 
	// model: ItemModel,
	url : "https://openapi.etsy.com/v2/listings/active.js",
	_key:"b6devysg94wdkfnin8lck4yb",


	parse: function(rawJSON){
		// console.log("rawJSON", rawJSON, rawJSON.results)
		return rawJSON.results

	},

	initialize: function(){
		this.url = this.url + "?api_key=" + this._key + "&callback=?"	//url without pictures!!
		//"&callback=?" to let the browers know that is JSONP is the response data
	}


})



var MktView = Backbone.View.extend({
	el: "#container", //selector where the data will be render for the view 

	events: {
		'click .itemContainer': '_navToItem'
	},	 

	_navToItem: function(evt){
		// console.log('currentTarget', evt.currentTarget)	//see if the correct target is being selected
		var clickItem = evt.currentTarget.getAttribute('id')
		// console.log(clickItem)
		window.location.hash = 'itemListing/' + clickItem

	},

	_buildTemplate: function(modelArr){
		var htmlStr = ""

		for(var i=0; i<modelArr.length; i++){
			// console.log("modelArr", modelArr[i])
			var mArr = modelArr[i]
			// console.log("Model Arr", mArr)

			htmlStr += '<div class="itemContainer" id='+mArr.get('listing_id')+'>'
			htmlStr += 		'<p>' + mArr.get('title') + '</p>'
			htmlStr +=		'<img src="' + mArr.get('Images')[0].url_75x75 + '">'
			htmlStr +=		'<p>' + "Item Id:" + mArr.get('listing_id') + '</p>'
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
		// console.log(this.mColl)
	}


})


var SingleItemView = Backbone.View.extend({
	el: "#container",

	_buildTemplate: function(singleItemModel){
		// console.log("singleItemModel",singleItemModel)
		// var singleItem = singleItemModel.models[0].attributes
		// var singleItem = singleItemModel.models[20]
		// var singleItem = singleItemModel
		var singleItem = singleItemModel
			// currentI = 0
		console.log('singleItemModel', singleItemModel)

		var	htmlStr = '<div id="itemListing">'

			htmlStr += 		'<p>' + singleItem.get('title') + '</p>'
			htmlStr +=		'<img src="' + singleItem.get('Images')[0].url_75x75 + '">'
			htmlStr += 		'<p>'+ singleItem.get('description')+'</p>'
			htmlStr +=		'<p>' + "Item Id:" + singleItem.get('listing_id') + '</p>'
			htmlStr += 		'<p>' + "Price: $" + singleItem.get('price') + '</p>'
			htmlStr +=		'<p>' + "Quantity: " + singleItem.get('quantity') + '</p>'
			htmlStr += '</div>'	

		return htmlStr
	},
	


	_render: function(){
		this.el.innerHTML = this._buildTemplate(this.itemMod)
		// this.el.innerHTML = '<p>  this is the single view </p>'	//working single view render
	
	}, 

	initialize: function(singleItemModel){
		this.itemMod = singleItemModel
	}



	// _render: function(){
	// 	this.el.innerHTML = this._buildTemplate(this.iModel.models)
	// }, 

	// initialize: function(itModel){
	// 	this.iModel = itModel 
	// 	console.log(this.iModel)
	// }



})




var MktRouter = Backbone.Router.extend({
	routes : {
		"itemListing/:listing_id" : "showItemView",
		"market" : "showMktView",
		"*default": "showMktView"
	},

	showItemView: function(itemId){	
 
		var singleItemModel = new ItemModel(itemId)

		singleItemModel.fetch({
			dataType: 'jsonp',
			data: {
				includes: 'Images,Shop',
				api_key: singleItemModel._key,
			}
		}).then(function(){
			var itemView = new SingleItemView(singleItemModel)
			itemView._render()
		})

	},

	//to show mkt listing on the market page with the hash change
	showMktView: function(){

		var mktColl = new MktCollection()
		// console.log("mktColl", mktColl)
		
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