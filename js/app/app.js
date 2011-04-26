$(function(){
	/* 	App View
		Has every view. For switching different views
	*/

	window.AppView = Backbone.View.extend({
	
		el: $('#container'),
		
		events: {
			// listen to change of viewMin and viewMax
			// change views involved
		},
		
		// initialize all views, models and collection
		initialize: function(){
			var that = this;
			this.option = {
				viewMin: 0,
				viewMax: 0
			};
			window.Keywords = new KeywordCollection;
			this.KeywordsCollection = new KeywordCollectionView({app: that, model: Keywords});
			this.LineGraph = new LineGraphView({app: that, model: Keywords});
			this.TwitterTunnelVis = new TwitterTunnelVisView({app: that, model: Keywords});
			this.Details = new DetailsView({app: that, model: Keywords});
		}
	
	});
	
	window.App = new AppView;
	
});
