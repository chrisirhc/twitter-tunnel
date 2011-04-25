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
			
			this.KeywordsCollection = new KeywordCollectionView({app: that});
			this.LineGraph = new LineGraphView({app: that});
			this.TwitterTunnelVis = new TwitterTunnelVisView({app: that});
			this.Details = new DetailsView({app: that});
			
		}
	
	});
	
	window.App = new AppView;
	
});
