$(function(){
	
	/*  Tweet Model
		Stores single tweet
		
		Attributes:
		id:			(int) id of the tweet from twitter
		username: 	(string) username of the tweet
		content:	(string) content of the tweet
		date:		(int) UNIX timestamp of the tweet
		parent: 	(id) id to another Tweet
		
	*/
	
	window.Tweet = Backbone.Model.extend({
		
		initialize: function(){
			// throw error if any empty attributes (except parent)
			// validate parent id too?
		}
		
	});
	
	/*	Tweets Collection
		Store list of Tweet
		
		Properties:
		keyword:	(string) search term for this tweet list
	*/
	
	window.TweetCollection = Backbone.Collection.extend({
		
		model: Tweet,
		
		comparator: function(tweet){
			return tweet.get("id");
		},
		
		findSubgraph: function(id){
			var that = this;
			
			var reverseBFS = function(tobj){
				var recurThis = arguments.callee;
				if (tobj){
					var parentId = tobj.toJSON().parent;
					parentNodes = that.filter(function(t){ return t.get("id") == parentId });
					var parentOfParentNodes = _.map(parentNodes, function(t){
						return recurThis(t);
					});
					return _.flatten([tobj,parentOfParentNodes]);
				}
			}
			
			
			var findRoot = function(id){
				rootID = id;
				while (rootID.toJSON().parent != null){
					rootID = that.filter(function(t){
						return rootID.get("parent") == t.get("id") 
					})[0]; // assume only one parent per node
				}
				return rootID;
			}
			
			//var root = findRoot(startNode);
			// console.log(root);
			
			// not working
			var bfs = function(root){
				var queue = [ root ];
				var results = [];
				while (queue.length != 0){
					var node = queue.splice(0,1)[0].get("id"); // actually dequeue
					console.log(node);
					results.push( node ); // actually enqueue
					var newNodes = that.filter(function(t){ return t.get("parent") ==  node });
					console.log(newNodes);
					queue.push(  );
				}
				return _.flatten(results);
			}
			
			// var results = bfs(root);
			// console.log(results);
			
		}
		
	});
	
	
	/*  Keyword Model
		Stores tweets of some keyword and the state
		
		Attributes:
			content: 	(string) inputted keyword
			active: 	(boolean) whether the keyword should be visualized
			color: 		(string) css color for the nodes
			tweets: 	(id) Collection of tweets related to the keyword
		
		Method:
			(void) toggle: toggle the state of `active`
		
	*/
	
	window.Keyword = Backbone.Model.extend({
		
		initialize: function(){
			if (!this.get("keyword")){
				throw "cannot initialize: empty keyword";
			} else if (this.get("tweets") === undefined) {
				var tweets = new TweetCollection;
				tweets.keyword = this.get("keyword");
				this.set({tweets: tweets});
				this.fetchTweets();
			} else {
				this.set({tweets: new TweetCollection(this.get("tweets"))});
				this.set({"loaded": true});
			}
		},
		
		toggle: function(){
			this.save({'active': !this.get('active')});
		},
		
		clear: function(){
			this.destroy();
			this.view.remove();
		},
		
		fetchTweets: function() {
			addTweets = _.bind(this.addTweets, this);
			// Local debugging
			/*
			$.getJSON("js/app/sampledata-mathias.json", addTweets);

			// Swap out the below getJSON call with above when debugging
			*/
			$.getJSON("https://query.yahooapis.com/v1/public/yql?callback=?", {
				q: 'use "https://raw.github.com/gist/325c570edab32842e416/fce7c69b3043fbe0a57773c19413d7dcda3ef108/twitter.conversation.xml";' +
					'select * from twitter.conversation where q="' + this.get("keyword") + '"',
			format: 'json'
			}, addTweets);
		},

		addTweets: function (data) {
			var tweetCollection = this.get("tweets");
				// console.log(tweet.toJSON());
			if (data.query.count == 0)
				return;
			var data = data.query.results.results.results.tweet;
			_.each(data, function (el) {
				var tempDate = el.data.created_at;
				el.data.created_at = {
					datetime_gmt: tempDate,
					unix_timestamp: (new Date(tempDate).getTime() / 1000)
				};

				// TODO CHECK THIS
				// adjacencies property used for the JIT visualization
				el.adjacencies = [];
				if (el.children !== null) {
					el.children = el.children.split(",");
					// *Copy* it over to adjacencies
					el.adjacencies = el.children.slice();
				} else {
					el.children = [];
				}
				if (el.parent !== null) {
					el.adjacencies.push(el.parent);
				} else {
					el.adjacencies.push("0");
				}
				el.name = el.id;
			});
			// hide loading notification
			// Format the YQL data (get the tweet data)
			tweetCollection.add(data);
			this.save();
			this.set({"loaded": true});
			this.trigger("change:active", this);
		}
		
	});
	
	
	/*	Keyword Collection
		Store list of `keyword` models
		Presistent Data through localStorage
	*/
	
	window.KeywordCollection = Backbone.Collection.extend({
		model: Keyword,
		localStorage: new Store("keywords")
	});
	
	/*	Keyword View
		View for single keyword. Handles interaction of one keyword
		
	*/
	
	window.KeywordView = Backbone.View.extend({
		
		tagName: "li",
		className: "keywords",
		
		template: _.template('<%= keyword %><span class="delete-keyword"><img src="img/loading.gif"/></span>'),
		
		events: {
			"click" : "toggleActive",
			"click span.delete-keyword" : "deleteKeyword",
			"mouseenter" : "onStartHover",
			"mouseleave" : "onEndHover"
		},
		
		initialize: function(){
			_.bindAll(this, 'render', 'onHoverChange', 'onSelectionChange', 'finishLoading');
			this.model.view = this;

			if (!this.model.get('active')) {
				$(this.el).addClass('disabled');
			}

			this.model.get('tweets').bind('change:hovered', this.onHoverChange);
			this.model.get('tweets').bind('change:selected', this.onSelectionChange);

			this.model.get('tweets').any(this.onSelectionChange);
			this.model.bind('change:loaded', this.finishLoading);
		},

		finishLoading: function (model) {
			if (model.get("loaded") === true) {
				this.$(".delete-keyword").html("x");
			}
		},

		onHoverChange: function (tweet) {
			if (tweet.get('hovered') === true) {
				$(this.el).addClass('hovered');
			} else {
				$(this.el).removeClass('hovered');
			}
		},

		onSelectionChange: function (tweet) {
			if (tweet.get('selected') === true) {
				$(this.el).addClass('selected');
			} else if (!this.model.get('tweets').any(function (i) { return i.get("selected") === true;})) {
				$(this.el).removeClass('selected');
			}
			// Persist the selection
			this.model.save();
		},
		
		render: function(){
			$(this.el).html(this.template(this.model.toJSON()))
			.addClass("color-" + this.model.get("color"));
			// Just in case the model loads faster...
			this.finishLoading(this.model);
			return this;
		},
		
		toggleActive: function(){
			this.model.toggle();
			$(this.el).toggleClass('disabled');
		},
		
		// Try to delete the data from model first
		deleteKeyword: function(){
			this.model.clear();
		},
		
		// 
		remove: function(){
			// tell tunnelView to remove related nodes
			$(this.el).slideUp('fast');
		},
		
		onStartHover: function(){
			this.model.get('tweets').each(function(tweet) { tweet.set({hovered: true}); });
		},
		
		onEndHover: function(){
			this.model.get('tweets').each(function(tweet) { tweet.set({hovered: false}); });
		}
		
	});
	
	window.KeywordCollectionView = Backbone.View.extend({
		
		el: $('#keyword-container'),
		
		events: {
			"keypress #keyword-input-text": "addKeyword",
			"click #add-keyword": "showInputBox",
			"blur #keyword-input-text": "hideInputBox"
		},
		
		initialize: function(){
			// Hardcoded number of colors
			this.currentColor = -1;
			this.numberOfColors = 7;

			_.bindAll(this, 'addOne', 'addAll', 'render');
			this.input = this.$('#keyword-input-text');
			
			this.model.bind('add', this.addOne);
			this.model.bind('refresh', this.addAll);
			this.model.bind('all', this.render);
			
			// comment out the below line to turn off persistant storage
			this.model.fetch();

			if (this.model.length > 0) {
				this.currentColor = this.model.length - 1;
			}
		},
		
		showInputBox: function(){
			$('#add-keyword').hide();
			$('#add-keyword-container').show();
			this.input.focus();
		},
		
		hideInputBox: function(){
			this.input.val('');
			$('#add-keyword').show();
			$('#add-keyword-container').hide();
		},
		
		// render one keyword model to view
		addOne: function(keyword){
			var view = new KeywordView({model: keyword});
			
			$(view.render().el).hide()
				.appendTo(this.$("#keywords-list")).fadeIn('fast');
		},
		
		// based on addOne. render all keyword models to view.
		addAll: function() {
	    	this.model.each(this.addOne);
	    },
		
		// default attribute values for keyword
		newAttributes: function(){
			this.currentColor = (this.currentColor + 1) % this.numberOfColors;
			return {
				id: this.input.val(),
				keyword: this.input.val(),
				active: true,
				color: this.currentColor
			};
		},
		
		addKeyword: function(e){
			if (e.keyCode != 13) return;
			// Check whether this is already in
			if (!this.model.get(this.input.val())) {
				if(this.model.create(this.newAttributes())) {
					this.hideInputBox();
				}
			}
		}
		
	});
	
	
	
});