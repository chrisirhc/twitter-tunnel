$(function(){
	/*
	* TweetDetail View
	*/
	window.TweetDetail = Backbone.View.extend({
		tagName: "li",
		template: _.template('<img src="<%= data.user.profile_image_url %>"/><p><span class="username"><%= data.user.name %></span> <%= data.text %></p>'),
		events: {
			"mouseenter": "onStartHover",
			"mouseleave": "onEndHover",
			"click": "onClick"
		},
		initialize: function () {
			_.bindAll(this, "render");
			this.model.bind('change:hovered', this.render);
			this.model.bind('change:selected', this.render);
			this.model.detailView = this;
		},
		render: function () {
			$(this.el).html(this.template(this.model.toJSON()));
			if(this.model.get("hovered") === true) {
				$(this.el).addClass("hovered");
			} else {
				$(this.el).removeClass("hovered");
			}
			if(this.model.get("selected") === true) {
				$(this.el).addClass("selected");
			} else {
				$(this.el).removeClass("selected");
			}
			return this;
		},

		onClick: function() {
			// toggle selected
			this.model.set({selected: !this.model.get("selected")});
		},

		onStartHover: function(){
			this.model.set({hovered: true});
		},

		onEndHover: function(){
			this.model.set({hovered: false});
		}
	});
	
	/*	DetailsView
		
	*/
	window.DetailsView = Backbone.View.extend({
		
		el: $("#details-container"),
		
		events: {
			"click ol>li": "changeInterval",
		},
		
		initialize: function(){
      _.bindAll(this, "contentChange");
		  this.model.bind("change:active", this.contentChange);
			this.model.each(this.contentChange);
		},

		contentChange: function (model) {
			if(model.get('active') === true) {
				model.get('tweets').each(function (tweet) {
					var tweetView = tweet.detailView || new TweetDetail({model: tweet});
					this.$("#tweets-details").append(tweetView.render().el);
				});
			} else {
				// Remove the nodes
				model.get('tweets').each(function (tweet) {
					tweet.detailView && tweet.detailView.remove();
				});
			}
		},
		
		changeInterval: function(){
			
		},
		
		
	});
});
