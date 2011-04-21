$(function(){
	
	/*	TwitterTunnelView
		Has the main infovis (TwitterTunnel) and directly controls it
	
	*/
	
	window.TwitterTunnelVisView = Backbone.View.extend({
		
		el: $('#tunnel-container'),
		
		events: {
			"click #tunnel-button-forward": "fastforward",
			"click #tunnel-button-backward": "rewind"
		},
		
		initialize: function(op){
			_.bindAll(this, "refresh", "changeInterval");
			this.app = op.app;
			this.initJIT();
			
			this.app.bind("tt-option-interval-change", this.changeInterval);
			
			// should be init from keyword collection
			this.app.option.viewMin = this.rgraph.config.nearTime;
			this.app.option.viewMax = this.rgraph.config.farTime;
		},
		
		initJIT: function(){
			    //init data
      var json = window.sampledatajson;
			    //end
			
			var nodeColor = "#2278a7";
			var edgeColor = nodeColor;
			var bgcolor = "#fff";
			var lineWidth = 3;

			//init EventTunnel
			var rgraph = new $jit.EventTunnel({
			   //Where to append the visualization
			   injectInto: 'infovis',
			   //Optional: create a background canvas that plots
			   //concentric circles.
			   'background': {
			     'CanvasStyles': {
			       'strokeStyle': '#ccc'
			     },
			     // levelDistance = time interval in seconds
			     levelDistance: 30 * 60,
			     numberOfCircles: 5
			   },
			   // The canvas background color.
			   backgroundColor: bgcolor,
			   // Set the nearTime as the most recent tweet so that we can see
			   // something
			   nearTime: 1303282433,
			   farTime:  1303006711,
			   //Add navigation capabilities:
			   //zooming by scrolling and panning.
			   Navigation: {
			     enable: true,
			     panning: false,
			     zooming: 10
			   },

			   //Set Node and Edge styles.
			 Node: {
			   dim: 10,
			   overridable: true,
			   color: nodeColor,
			   lineWidth: lineWidth
			 },

			 NodeStyles: {
			   enable: true,
			   lineWidth: lineWidth,
			   stylesHover: {
			     dim: 15
			   },
			   duration: 600
			 },

			 onBeforePlotNode: function(node) {
			   if (node.data.type == "reply") {
			     node.data.$type = "reply";
			   } else {
			     node.data.$type = "retweet";
			   }
			   node.data.$lineWidth = lineWidth;
			 },

			 Edge: {
			   overridable: true,
			   color: edgeColor,
			   lineWidth:lineWidth
			 },

			 onBeforePlotLine: function(adj){
			   var nodeTo = adj.nodeTo;
			   if (nodeTo.data.type != "reply") {
			     adj.data.$type = "retweet";
			   }
			 },

			 //Add the name of the node in the correponding label
			 //and a click handler to move the graph.
			 //This method is called once, on label creation.
			 onCreateLabel: function(domElement, node){
			   domElement.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
			   domElement.onclick = function(){
			     rgraph.onClick(node.id);
			     ;  }
			 },
			 //Change some label dom properties.
			 //This method is called each time a label is plotted.
			 onPlaceLabel: function(domElement, node){
			   var style = domElement.style;
			   style.display = '';
			   style.cursor = 'pointer';

			   style.fontSize = "0.8em";
			   style.color = "#ccc";

			   var left = parseInt(style.left);
			   var w = domElement.offsetWidth;
			   style.left = (left - w / 2) + 'px';
			 }
			});
			//load JSON data
			rgraph.loadJSON(json);
			//trigger small animation
			rgraph.graph.eachNode(function(n) {
			 var pos = n.getPos();
			 pos.setc(0, 0);
			});
			rgraph.compute('end');
			rgraph.fx.animate({
			 modes:['polar'],
			 duration: 2000
			});
			//end
			
			// store a reference of rgraph for other functions to use
			this.rgraph = rgraph;
		},
		
		fastforward: function(){
			var step = 1000;
			this.app.option.viewMin += step;
	    	this.app.option.viewMax += step;
			console.log(this.app.option.viewMin);
			this.app.trigger("tt-option-interval-change");
		},
		
		rewind: function(){
			var step = 1000;
			this.app.option.viewMin -= step;
	    	this.app.option.viewMax -= step;
			console.log(this.app.option.viewMin);
			this.app.trigger("tt-option-interval-change");
		},
		
		changeInterval: function(){
			console.log("twitter-tunnel changing interval");
			var that = this;
			this.rgraph.fx.animateTime(that.app.option.viewMin, that.app.option.viewMax, {modes:['polar'], duration:500});
		},
		
		refresh: function(){
			console.log("refresh");
			this.rgraph.refresh();
		}
		
		
	});
	
});