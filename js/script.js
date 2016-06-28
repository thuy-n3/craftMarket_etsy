// console.log($)
// console.log(_)
// console.log(Backbone)

//api_key = "b6devysg94wdkfnin8lck4yb"

//https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}
//https://openapi.etsy.com/v2/listings/active?api_key=b6devysg94wdkfnin8lck4yb // working

//listing# sample 269818178

location.hash = 'home'
var ItemModel = Backbone.Model.extend({
	url: function() {
		return "https://openapi.etsy.com/v2/listings/" + this.itemId + ".js"
	},
	// url: 'https://openapi.etsy.com/v2/listings/' + this.itemId + '.js',
	_key: "b6devysg94wdkfnin8lck4yb",

	parse: function(rawJSON){
		// console.log('parse JSON')
		console.log("rawJSON results @ 0", rawJSON.results)

		// console.log("rawJSON-SingleView", rawJSON, rawJSON.results[0])
		return rawJSON.results[0]
			console.log(this.url)

	},

	initialize: function(listingId){
		this.itemId = listingId
		console.log(this.itemId)
	}

})

var MktCollection = Backbone.Collection.extend({	//collection of the marketing listing 
	// model: ItemModel,
	url: "https://openapi.etsy.com/v2/listings/active.js",
	_key: "b6devysg94wdkfnin8lck4yb",


	parse: function(rawJSON){
		// console.log("rawJSON", rawJSON, rawJSON.results)
		return rawJSON.results

	},

	initialize: function(){

		// this.url = this.url + "?api_key=" + this._key + "&callback=?"	//url without pictures!!
		//"&callback=?" to let the browers know that is JSONP is the response data
	}


})





var MktView = Backbone.View.extend({
	el: "#container", //selector where the data will be render for the view 

	events: {
		'click .itemContainer': '_navToItem'
	},	

	_navToItem: function(evt){
		console.log('currentTarget', evt.currentTarget)	//see if the correct target is being selected
		var clickItem = evt.currentTarget.getAttribute('id')

		console.log(clickItem)
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

var SearchView = Backbone.View.extend({
	el: "#header",

	events: {

		"keydown .searchBox": "_navSearchView" 
	},

	_navSearchView: function(evt){
		// console.log(evt.target.value)	//picks up what is typed in the search box 
		if(evt.keyCode === 13){
			console.log(evt.target.value)
			var searchInput = evt.target.value
			// console.log(searchInput)
			location.hash = "search/" + searchInput
			evt.target.value = ''
		}

	}, 


	_buildTemplate: function(){

		var htmlStr = ''
		return htmlStr

	},

	_render: function(){
		this.el.innerHTML += this._buildTemplate(this.searchColl)

	},

	initialize: function(MktCollection){
		this.searchColl = MktCollection
	}


})



var MktRouter = Backbone.Router.extend({
	routes : {
		"itemListing/:listing_id" : "showItemView",
		"search/:searchInput" : "showSearchView",
		"market" : "showMktView",
		"*default": "showMktView"
	},

	// doItemSearch: function(searchInput){

	// 	var searchCollection = new MktCollection()
	// 		searchCollection.fetch({
	// 			dataType: 'jsonp', 
	// 			data: {
	// 				includes: 'Images,Shop',
					
	// 				keyword: searchItem
	// 			}
	// 		}).then(function(){
	// 			var searchView = new MktView(MktCollection)
	// 			searchView._render()
	// 	})

	// }, 


	showSearchView: function(searchInput){

		var searchCollection = new MktCollection()
			console.log("searchCollection",searchCollection)

			searchCollection.fetch({
				dataType: 'jsonp', 
				data: {
					api_key: searchCollection._key,
					includes: 'Images,Shop',
	 				keywords: searchInput
	 			}
			}).then(function(responseData){
				console.log(searchCollection.url)	
				console.log("searchViewData", responseData)
				var searchView = new MktView(searchCollection)
				searchView._render()
			})

	},

	showItemView: function(itemId){	

 
		var singleItemModel = new ItemModel(itemId)

		singleItemModel.fetch({
			dataType: 'jsonp',
			data: {
				includes: 'Images,Shop',
				api_key: singleItemModel._key,
				listing_id: itemId
			}
		}).then(function(){
			console.log("singleItemURL",singleItemModel.url)
			console.log("singleItemModel",singleItemModel)
			var itemView = new SingleItemView(singleItemModel)
			itemView._render()
		})

	},

	//to show mkt listing on the market page with the hash change
	showMktView: function(){

		var mktColl = new MktCollection()
		// console.log("mktColl", mktColl)
		
		mktColl.fetch({
			dataType: 'jsonp',
			data: {
				includes: 'Images,Shop',
				api_key: mktColl._key
			}
		}).then(function(d){
			var mView = new MktView(mktColl)	//going to have to define MktView!!!
			mView._render()
		})

	},

	initialize: function(){
		var mktSearchView = new SearchView()
		Backbone.history.start()
	}


})

new MktRouter()