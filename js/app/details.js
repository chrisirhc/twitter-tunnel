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
			_.bindAll(this, "render", "changeInterval");
			// clear hover setting
			this.model.set({hovered: false});
			this.model.bind('change:hovered', this.render);
			this.model.bind('change:selected', this.render);
			this.model.detailView = this;
			this.options.app.bind("tt-option-interval-change", this.changeInterval);
		},
		changeInterval: function () {
			if(this.model.get("data").created_at.unix_timestamp*1000 < this.options.app.option.viewMin ||
				 this.model.get("data").created_at.unix_timestamp*1000 > this.options.app.option.viewMax ) {
				$(this.el).fadeOut();
			} else {
				$(this.el).fadeIn();
			}
		},
		render: function () {
			$(this.el).html(this.template(this.model.toJSON()))
			.addClass("color-" + this.color);
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
      _.bindAll(this, "contentChange", "scrollTo");
		  this.model.bind("change:active", this.contentChange);
			this.model.each(this.contentChange);
		},

		contentChange: function (model) {
			if(model.get('active') === true) {
				model.get('tweets').each(_.bind(function (tweet) {
					var tweetView = tweet.detailView || new TweetDetail({app: this.options.app, model: tweet});
					tweetView.delegateEvents();
					tweetView.color = model.get('color');
					this.$("#tweets-details").append(tweetView.render().el);
				}, this));
				model.get('tweets').bind("change:selected", this.scrollTo);
			} else {
				// Remove the nodes
				model.get('tweets').each(function (tweet) {
					tweet.detailView && tweet.detailView.remove();
				});
				model.get('tweets').unbind("change:selected", this.scrollTo);
			}
		},

		scrollTo: function (model) {
			if (model.get("selected") === true) {
				var tweetDetailsBox = this.$("#tweets-details");
				tweetDetailsBox.scrollTop(tweetDetailsBox.scrollTop() + $(model.detailView.el).position().top);
			}
		},
		
		changeInterval: function(){
			
		},
		
		
	});
});
