$(function(){
	/* 	App View
		Has every view. For switching different views
	*/

	window.AppView = Backbone.View.extend({
	
		el: $('body'),
	
		// initialize all views, models and collection
		initialize: function(){
			this.KeywordsCollection = new KeywordCollectionView({app: this});
			this.TwitterTunnelVis = new TwitterTunnelVisView({app: this});
			this.LineGraph = new LineGraphView({app: this});
		}
	
	});
	
	window.App = new AppView
	
});
