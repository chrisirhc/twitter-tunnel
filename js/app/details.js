$(function(){
	/*
	* TweetDetail View
	*/
	window.TweetDetail = Backbone.View.extend({
		tagName: "li",
		template: _.template('<img src="<%= data.user.profile_image_url %>"/><p><span class="username"><%= data.user.name %></span> <%= data.text %></p>'),
		initialize: function () {
			this.model.bind('change:selected', this.render);
			this.model.detailView = this;
		},
		render: function () {
			$(this.el).html(this.template(this.model.toJSON()));
			return this;
		}
	});
	
	/*	DetailsView
		
	*/
	window.DetailsView = Backbone.View.extend({
		
		el: $("#details-container"),
		
		events: {
			"click ol>li": "changeInterval",
			"mouseover ol>li": "addHoverClass",
			"mouseout ol>li": "removeHoverClass",
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
		
		addHoverClass: function(){
			this.$("ol>li").addClass('hover');
		},
		
		removeHoverClass: function(){
			$("#tweets-details li").removeClass('hover');
		}
		
		
	});
});