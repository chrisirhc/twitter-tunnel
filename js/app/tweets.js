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
		
	})
	
	/*	TweetList Collection
		Store list of Tweet
		
		Properties:
		keyword:	(string) search term for this tweet list
	*/
	
	window.TweetList = Backbone.Collection.extend({
		
		model: Tweet,
		localStorage: new Store("tweets-"+this.cid)
		
	})
	
	
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
			} else {
				var tweets = new TweetList;
				tweets.keyword = this.get("keyword")
				this.set({tweets: tweets});
				// show loading notification
				this.fetchTweets();
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
			// getJSON some URL
			var json = [
				{
					"id": 1352453845,
					"username": "coolguy",
					"content": "something",
					"date": 1299995252,
					"parent": null
				},
				{
					"id": 135304853049683,
					"username": "someone",
					"content": "blah",
					"date": 1299996521,
					"parent": 1352453845
				}
			];
			
			// move to getJSON callback
			var tweetList = this.get("tweets");
			_.map(json, function(t){
				var tweet = new Tweet(t);
				tweetList.add(tweet);
				console.log(tweet.toJSON());
			});
			// hide loading notification
			
			// end: move to getJSON callback
		}
		
	});
	
	
	/*	Keywords Collection
		Store list of `keyword` models
		Presistent Data through localStorage
	*/
	
	window.KeywordList = Backbone.Collection.extend({
		model: Keyword,
		localStorage: new Store("keywords")
	});
	
	
	window.Keywords = new KeywordList;
	
	/*	Keyword View
		View for single keyword. Handles interaction of one keyword
		
	*/
	
	window.KeywordView = Backbone.View.extend({
		
		tagName: "li",
		className: "keywords",
		
		template: _.template("<%= keyword %><span class='delete-keyword'>x</span>"),
		
		events: {
			"click" : "toggleActive",
			"click span.delete-keyword" : "deleteKeyword"
		},
		
		initialize: function(){
			_.bindAll(this, 'render');
			this.model.view = this;
		},
		
		render: function(){
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		},
		
		toggleActive: function(){
			if (this.model.get('active')){
				// tell tunnelView to hide relate nodes
			}
			else{
				// tell tunnelView to show relate nodes
			}
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
		}
		
	});
	
	window.KeywordsView = Backbone.View.extend({
		
		el: $('#keyword-container'),
		
		events: {
			"keypress #keyword-input-text": "addKeyword",
			"click #add-keyword": "showInputBox",
			"blur #keyword-input-text": "hideInputBox"
		},
		
		initialize: function(){
			_.bindAll(this, 'addOne', 'addAll', 'render');
			this.input = this.$('#keyword-input-text');
			
			Keywords.bind('add', this.addOne);
			Keywords.bind('refresh', this.addAll);
			Keywords.bind('all', this.render);
			
			// comment out the below line to turn off persistant storage
			Keywords.fetch();
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
	    	Keywords.each(this.addOne);
	    },
		
		// default attribute values for keyword
		newAttributes: function(){
			return {
				keyword: this.input.val(),
				active: true
			};
		},
		
		addKeyword: function(e){
			if (e.keyCode != 13) return;
			console.log('adding keyword');
			Keywords.create(this.newAttributes());
			this.hideInputBox();
			
			// Tell LineChartView to load the new tweets data
			
			// Tell TunnelView to load the tweets
			
		}
	});
	
	window.KeywordListView = new KeywordsView;
	
});