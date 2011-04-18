$(function(){
	
	/*  Tweet Model
		Stores single tweet
		
		Attributes:
		username: (string) username of the tweet
		content: (string) content of the tweet
		parent: (cid)
		
	*/
	
	
	/*  Keyword Model
		Stores tweets of some keyword and the state
		
		Attributes:
		content: (string) inputted keyword
		active: (boolean) whether the keyword should be visualized
		(not done) color: (string) css color for the nodes
		(not done) tweets: (id Backbone.Collection) tweets related to the keyword
		
		Method:
		toggle: toggle the state of `active`
		getTweets: asynchronously get the tweets for the keyword, format the data and save them to `tweet` as arrays
		
	*/
	window.Keyword = Backbone.Model.extend({
		
		initialize: function(){
			if (!this.get('keyword')){
				throw "cannot initialize: empty keyword";
			} else {
				// Fetch Tweets
			}
		},
		
		toggle: function(){
			this.save({'active': !this.get('active')});
		},
		
		clear: function(){
			this.destroy();
			this.view.remove();
		}
		
	});
	
	
	/*	Keywords Collection
		Store list of `keyword` models
		Presistant Data through localStorage
		
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
			this.model.toggle();
			$(this.el).toggleClass('disabled');
		},
		
		// Try to delete the data from model first
		deleteKeyword: function(){
			this.model.clear();
		},
		
		// 
		remove: function(){
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
			
			// switch for persistant storage
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
			
			// Tell LineChartView to load the new tweets data
			
			// Tell TunnelView to load the tweets
			
			this.hideInputBox();
		}
	})
	
	window.KeywordListView = new KeywordsView;
	
});