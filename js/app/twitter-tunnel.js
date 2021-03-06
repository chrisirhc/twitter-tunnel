$(function(){
	
	/*	TwitterTunnelView
		Has the main infovis (TwitterTunnel) and directly controls it
	
	*/
	
	window.TwitterTunnelVisView = Backbone.View.extend({
		
		el: $('#tunnel-container'),
		
		events: {
			"click #tunnel-button-forward": "fastforward",
			"click #tunnel-button-backward": "rewind",
			"click #tunnel-button-halve-ring": "halveRing",
			"click #tunnel-button-double-ring": "doubleRing",
			
			"mousemove #infovis" : "getTimeFromCursor",
			"mouseout #infovis": "removeCursorLine",
			
			"mouseover #tunnel-time-label" : "showRingIntervalLabel",
			"mouseout #tunnel-time-label": "hideRingIntervalLabel"
		},
		
		initialize: function(op){
			_.bindAll(this, "refresh", "changeInterval", "changeButtonState", "changeInterval", "contentChange");
			this.app = op.app;

			this.initJIT();
			
			this.app.bind("tt-option-interval-change", this.changeInterval);
			this.model.bind('change:active', this.contentChange);

			// Look through collection once initialized
			this.model.each(this.contentChange);
		},

		contentChange: function (model) {
			var data = model.get('tweets').toJSON();
			if(model.get('active') === true) {
				if (data.length) {
					for (var i=0; i < data.length; i++) {
						// Process the data before passing it to JIT
						data[i].data.keyword = model.get('keyword');
						data[i].data.type = data[i].type;
						delete data[i].children;
						delete data[i].parent;
					}

					// For now, just show everything?
					this.rgraph.setTimeStep(this.app.option.viewMax - this.app.option.viewMin);
					// this.app.option.viewMin = data[0].data.created_at.unix_timestamp * 1000;
					// this.app.option.viewMax = data[data.length-1].data.created_at.unix_timestamp * 1000;
					this.changeInterval();
					this.rgraph.setTimeStep((this.app.option.viewMax - this.app.option.viewMin) / 1000 / 10);
					this.rgraph.op.sum(data, {type: 'replot'});

					model.insertedOnJIT = true;
					// Bind select methods
				}
			} else if (model.insertedOnJIT) {
				// Remove the nodes
				var list = _.pluck(data, 'id');
				this.rgraph.op.removeNode(list.reverse(), {type: 'nothing'});
				this.rgraph.refresh();
				model.insertedOnJIT = false;
			}
		},
		
		initJIT: function(){
			var that = this;
			
			//init data
			var json = [{
				id: "0",
				name: "Faux Node",
				data: {
					"$alpha": 0
				}
			}];
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
			   nearTime: that.app.option.viewMax / 1000,
			   farTime:  that.app.option.viewMin / 1000,
				 maxRingRadius: 200,
				 minRingRadius: 25,
			   //Add navigation capabilities:
			   //zooming by scrolling and panning.
			   Navigation: {
			     enable: false,
			     panning: false
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
			   if (node.data.type == "retweet") {
			     node.data.$type = "retweet";
			   } else {
			     node.data.$type = "reply";
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
	          rgraph.onClick(node.id, {x: domElement.offsetLeft, y: domElement.offsetTop, time: node.data.created_at.unix_timestamp});
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
			 },
			onComplete: function(){
				that.app.trigger("tt-oncomplete");
			},
			 Events: {
				 enable: true,
				 onClick: function(node) {
					 if (node.data && node.data.keyword) {
						 var tweet = that.model.get(node.data.keyword).get("tweets").get(node.id);
						 tweet.set({"selected": !tweet.get("selected")});
					 }
				 },
				 onMouseEnter: function(node) {
					 var tweet = that.model.get(node.data.keyword).get("tweets").get(node.id);
					 tweet.set({"hovered": true});
				 },
				 onMouseLeave: function(node) {
					 var tweet = that.model.get(node.data.keyword).get("tweets").get(node.id);
					 tweet.set({"hovered": false});
				 }
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
			
			// set initial timeStep and store to that.app
			that.app.option.timeStep = this.rgraph.getTimeStep();
		},
		
		fastforward: function(){
			var that = this;
			
			var step = (that.app.option.viewMax - that.app.option.viewMin) * 0.5;
			
			var newMin = that.app.option.viewMin + step;	
	    	var newMax = that.app.option.viewMax + step;
			if (newMax<=that.app.option.dataMax){
				that.app.option.viewMin = newMin;
				that.app.option.viewMax = newMax;
			}
			else{
				that.app.option.viewMin += that.app.option.dataMax - that.app.option.viewMax;
				that.app.option.viewMax = that.app.option.dataMax;
			}
			that.app.trigger("tt-option-interval-change");
		},
		
		rewind: function(){
			var that = this;
			
			var step = (that.app.option.viewMax - that.app.option.viewMin) * 0.5;
			
			var newMin = that.app.option.viewMin - step;	
	    	var newMax = that.app.option.viewMax - step;
			if (newMin>=that.app.option.dataMin){
				that.app.option.viewMin = newMin;
				that.app.option.viewMax = newMax;
			}
			else{
				that.app.option.viewMax -= that.app.option.viewMin - that.app.option.dataMin;
				that.app.option.viewMin = that.app.option.dataMin;
			}
			that.app.trigger("tt-option-interval-change");
		},
		
		doubleRing: function(){
			var that = this;
			
			var currentTimeStep = that.app.option.timeStep;
			var newTimeStep = currentTimeStep / 2;
			
			that.rgraph.setTimeStep(newTimeStep);
			that.app.option.timeStep = newTimeStep;
			
			that.app.trigger("tt-option-timestep-change");
			that.app.trigger("tt-oncomplete");
			this.updateRingIntervalLabel();
		},
		
		halveRing: function(){
			var that = this;
			
			var currentTimeStep = that.app.option.timeStep;
			var newTimeStep = currentTimeStep * 2;
			
			that.rgraph.setTimeStep(newTimeStep);
			that.app.option.timeStep = newTimeStep;
			
			that.app.trigger("tt-option-timestep-change");
			that.app.trigger("tt-oncomplete");
			
			this.updateRingIntervalLabel();
		},
		
		changeInterval: function(){
			var that = this;
			
			console.log("twitter-tunnel changing interval");
			console.log(that.app.option.viewMin / 1000);
			
			// change button state
			if (that.app.option.viewMax < that.app.option.dataMax){
				that.changeButtonState({ forward: true, backward: null});
			}
			else {
				that.changeButtonState({ forward: false, backward: null});
			}
			
			if (that.app.option.viewMin > that.app.option.dataMin){
				that.changeButtonState({ forward: null, backward: true});
			}
			else {
				that.changeButtonState({ forward: null, backward: false});
			}
			
			// actually change the view of twitter tunnel
			var newNearTime = that.app.option.viewMax / 1000;
			var newFarTime = that.app.option.viewMin / 1000
			this.rgraph.fx.animateTime(newNearTime, newFarTime, {modes:['polar'], duration: 1500 } );
			this.updateTimeLabel();
			this.updateRingIntervalLabel();
		},
		
		refresh: function(){
			console.log("refresh");
			this.rgraph.refresh();
		},
		
		changeButtonState: function(state){
			var that = this;
			if (state.forward == true){
				$('#tunnel-button-forward').removeClass('disabled');
			}
			else if (state.forward == false){
				$('#tunnel-button-forward').addClass('disabled');
			}
			if (state.backward == true){
				$('#tunnel-button-backward').removeClass('disabled');
			}
			else if (state.backward == false){
				$('#tunnel-button-backward').addClass('disabled');
			}
		},
		
		getTimeFromCursor: function(e){
			var infovisOffset = $('#infovis').offset();
			
			var x = e.pageX - infovisOffset.left;
			var y = e.pageY - infovisOffset.top;
			var computedTime = this.rgraph.getTimeAtPosition(x,y);

			this.app.trigger("tt-cursor-position-change", {pos: computedTime*1000, id: 'line-cursor', replace: true, color: "rgba(255,0,0,0.75)"});
		},
		
		removeCursorLine: function(){
			this.app.trigger("tt-cursor-out", 'line-cursor');
		},
		
		updateTimeLabel: function(){
			
			var startTime = new Date( this.app.option.viewMin );
			var endTime = new Date( this.app.option.viewMax );
			
			var month=new Array(12);
			month[0]="Jan";
			month[1]="Feb";
			month[2]="Mar";
			month[3]="Apr";
			month[4]="May";
			month[5]="Jun";
			month[6]="Jul";
			month[7]="Aug";
			month[8]="Sep";
			month[9]="Oct";
			month[10]="Nov";
			month[11]="Dec";
			
			var startTimeString = 	month[ startTime.getMonth() ] + " " 
									+ startTime.getDate() + " "
									+ startTime.getHours() + ":"
									+ (startTime.getMinutes()<10?
										"0"+(startTime.getMinutes()+''):
										startTime.getMinutes());
			
			var endTimeString = 	month[ endTime.getMonth() ] + " "
									+ endTime.getDate() + " "
									+ endTime.getHours() + ":"
									+ (endTime.getMinutes()<10?
										"0"+(endTime.getMinutes()+''):
										endTime.getMinutes());
			
			$("#tunnel-time-label");
			$("span#start-time").text(startTimeString);
			$("span#end-time").text(endTimeString);
		},
		
		updateRingIntervalLabel: function(){
			
			var that = this;
			var timeStep = that.app.option.timeStep;
			$("#tunnel-ring-interval").text(timeStep/60+' Minutes');
			
		},
		
		showRingIntervalLabel: function(){
			$("#tunnel-ring-interval-container").removeClass("hidden");
		},
		
		hideRingIntervalLabel: function(){
			$("#tunnel-ring-interval-container").addClass("hidden");
		}
		
	});
	
});
