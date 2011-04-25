$(function(){
	
	window.LineGraphView = Backbone.View.extend({
		
		el: $("#overview-container"),
		
		events:{
			'click #overview-button-6-hour': 'changeIntervalSixHours',
			'click #overview-button-24-hour': 'changeIntervalOneDays',
			'click #overview-button-3-day': 'changeIntervalThreeDays',
			'click #overview-button-all': 'changeIntervalAll',
			'click #overview-button-forward': 'changeIntervalForward',
			'click #overview-button-backward': 'changeIntervalBackward'
		},
		
		initialize: function(op){
			_.bindAll(this, "changeInterval");
			
			this.app = op.app;
			this.initHighcharts();
			
			this.app.bind("tt-option-interval-change", this.changeInterval);
		},
		
		initHighcharts: function(){
			this.data = [
				0,0,0,4,7,135,35,32,24,12,3,4,
				7,56,15,2,10,34,64,24,6,4,8,57,5,34,5,6,
				7,3,46,56,45,24,65,79,1,2,3,4,5,53,23,3,76,
				7,56,15,2,10,34,64,24,6,4,8,57,5,34,5,6,
			];
			
			this.initData();
			
			// this.masterStart = Date.UTC(2006, 0, 01, 0, 0, 0);
			// this.masterEnd = Date.UTC(2006, 0, 03, 12, 0, 0);
			
			// for debug only. should get from tweetscollection
			this.app.option.viewMin = this.detailStart;
			this.app.option.viewMax = this.masterEnd;
			
			// controls the zooming of the master graph
			this.pointInterval = 0.5 * 3600 * 1000; // hourly
			
			// create master and in its callback, create the detail chart
			this.createMaster();
		},
		
		// helper function for initHighcharts
		createDetail: function(masterChart){
		
			// prepare the detail chart
			var detailData = [],
				detailStart = this.detailStart;

			jQuery.each(masterChart.series[0].data, function(i, point) {
				if (point.x >= detailStart) {
					detailData.push(point.y);
				}
			});

			// create a detail chart referenced by a global variable
			this.detailChart = new Highcharts.Chart({
				chart: {
					renderTo: 'overview-detail-container',
					zoomType: 'x',
					reflow: false,
					backgroundColor: 'transparent',
					
				},
				credits: {
					enabled: false
				},
				title: {
					text: ''
				},
				xAxis: {
					type: 'datetime'
				},
				yAxis: {
					title: null,
					min: 0,
					maxZoom: 0.1,
					minorTickInterval: 'auto'
				},
				tooltip: {
					formatter: function() {
						var point = this.points[0];
						return '<b>'+ point.series.name +'</b><br/>'+
							Highcharts.dateFormat('%A %B %e %Y', this.x) + ':<br/>'+
							'1 USD = '+ Highcharts.numberFormat(point.y, 2) +' EUR';
					},
					shared: true
				},
				legend: {
					enabled: false
				},
				plotOptions: {
					series: {
						marker: {
							enabled: false,
							states: {
								hover: {
									enabled: true,
									radius: 3
								}
							}
						}
					}
				},
				series: [{
					name: '# of tweets',
					pointStart: detailStart,
					pointInterval: this.pointInterval,
					data: detailData
				}],

				exporting: {
					enabled: false
				}

			});
			
		},
		
		// helper function for initHighcharts
		createMaster: function(){
			var that = this;
			that.masterChart = new Highcharts.Chart({
				chart: {
					renderTo: 'overview-master-container',
					reflow: false,
					borderWidth: 0,
					backgroundColor: null,
					zoomType: 'x',
					events: {

						// listen to the selection event on the master chart to update the 
						// extremes of the detail chart
						selection: function(event) {
							
							var extremesObject = event.xAxis[0];
							that.app.option.viewMin = extremesObject.min;
							that.app.option.viewMax = extremesObject.max;
							
							console.log(that.app.option.viewMin);
							console.log(that.app.option.viewMax);
							
							that.app.trigger("tt-option-interval-change");
							return false;
						}
					}
				},
				title: {
					text: null
				},
				xAxis: {
					type: 'datetime',
					showLastTickLabel: true,
					maxZoom: 14 * 24 * 3600000, // fourteen days
					plotBands: [{
						id: 'mask-before',
						from: that.masterStart,
						to: that.detailStart,
						color: 'rgba(0, 0, 0, 0.5)'
					}],
					title: {
						text: null
					},
				},
				yAxis: {
					gridLineWidth: 0,
					labels: {
						enabled: false
					},
					title: {
						text: null
					},
					min: 0.6,
					showFirstLabel: false
				},
				tooltip: {
					formatter: function() {
						return false;
					}
				},
				legend: {
					enabled: false
				},
				credits: {
					enabled: false
				},
				plotOptions: {
					series: {
						fillColor: {
							linearGradient: [0, 0, 0, 70],
							stops: [
								[0, '#4572A7'],
								[1, 'rgba(0,0,0,0)']
							]
						},
						lineWidth: 1,
						marker: {
							enabled: false
						},
						shadow: false,
						states: {
							hover: {
								lineWidth: 1						
							}
						},
						enableMouseTracking: false
					}
				},

				series: [{
					type: 'area',
					name: '',
					pointInterval: that.pointInterval,
					pointStart: that.masterStart,
					data: that.data
				}],

				exporting: {
					enabled: false
				}

			}, function(masterChart) {
				that.createDetail(masterChart)
			});
		},
		
		changeInterval: function(){
			
			var that = this;
			
			console.log("line graph changing interval");
			console.log(that.app.option.viewMin);
			
			var detailData = []
			var xAxis = that.masterChart.xAxis[0];
			
			// reverse engineer the last part of the data
			jQuery.each(that.masterChart.series[0].data, function(i, point) {
				if (point.x > that.app.option.viewMin && point.x < that.app.option.viewMax) {
					detailData.push({
						x: point.x,
						y: point.y
					});
				}
			});

			// move the plot bands to reflect the new detail span
			xAxis.removePlotBand('mask-before');
			xAxis.addPlotBand({
				id: 'mask-before',
				from: that.masterStart,
				to: that.app.option.viewMin,
				color: 'rgba(0, 0, 0, 0.5)'
			});

			xAxis.removePlotBand('mask-after');
			xAxis.addPlotBand({
				id: 'mask-after',
				from: that.app.option.viewMax,
				to: that.masterEnd,
				color: 'rgba(0, 0, 0, 0.5)'
			});
			that.detailChart.series[0].setData(detailData);
			
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
		},
		
		
		// helper function for grouping a list specify by the interval and the starting value
		// the list has to be sorted
		bucketList: function(list,interval,start){
			var newList = [];
			var temp = [];
			var curBucketMax = start + interval;
			for (item in list){
				while (list[item].data.created_at.unix_timestamp>curBucketMax){
					newList.push(temp);
					temp = [];
					curBucketMax += interval;
				}
				temp.push( list[item] );
			}
			if (temp.length!=0){
				newList.push(temp);
			}
			return newList;
		},
		
		changeIntervalSixHours: function(){
			var that = this;
			var newMax = that.app.option.viewMin + 6 * 3600 * 1000
			that.app.option.viewMax = 
				newMax<=that.app.option.dataMax? // masterEnd should get from tweetcollection
					newMax:
					that.app.option.dataMax;
			
			that.app.trigger("tt-option-interval-change");
		},
		
		changeIntervalOneDays: function(){
			var that = this;
			var newMax = that.app.option.viewMin + 24 * 3600 * 1000
			console.log(newMax);
			that.app.option.viewMax = 
				newMax<=that.app.option.dataMax? // masterEnd should get from tweetcollection
					newMax:
					that.app.option.dataMax;;
			
			that.app.trigger("tt-option-interval-change");
		},
		
		changeIntervalThreeDays: function(){
			var that = this;
			var newMax = that.app.option.viewMin + 3 * 24 * 3600 * 1000
			that.app.option.viewMax = 
				newMax<=that.app.option.dataMax? // masterEnd should get from tweetcollection
					newMax:
					that.app.option.dataMax;;
			
			that.app.trigger("tt-option-interval-change");
		},
		
		changeIntervalAll: function(){
			var that = this;
			that.app.option.viewMin = that.app.option.dataMin;
			that.app.option.viewMax = that.app.option.dataMax;
			that.app.trigger("tt-option-interval-change");
		},
		
		// to preprocess data for linegraph
		initData: function(){
			// sort by timestamp
			// using sample data. should get from tweetcollection
			this.data = _.sortBy( _.tail(window.sampledatajson), 
				function(i) { return i.data.created_at.unix_timestamp });
			this.masterStart = this.data[0].
				data.created_at.unix_timestamp * 1000; // convert to ms
			this.masterEnd = this.
				data[ this.data.length-1 ].data.created_at.unix_timestamp * 1000; // convert to ms
			this.detailStart = this.masterEnd - 6 * 3600 * 1000; // hardcoded to display last 6 hours of tweet
			this.data = this.bucketList( this.data, 0.5 * 3600, this.masterStart / 1000 );
			this.data = _.map( this.data, function(i){ return i.length } );
			
			// for testing only. should be saved by tweetcollection
			// save global latest and oldest timestamp
			this.app.option.dataMin = this.masterStart;
			this.app.option.dataMax = this.masterEnd;
			
		},
		
		changeIntervalForward: function(){
			this.app.TwitterTunnelVis.fastforward();
		},
		
		changeIntervalBackward: function(){
			this.app.TwitterTunnelVis.rewind();
		},
		
		changeButtonState: function(state){
			var that = this;
			if (state.forward == true){
				$('#overview-button-forward').removeClass('disabled');
			}
			else if (state.forward == false){
				$('#overview-button-forward').addClass('disabled');
			}
			if (state.backward == true){
				$('#overview-button-backward').removeClass('disabled');
			}
			else if (state.backward == false){
				$('#overview-button-backward').addClass('disabled');
			}
		}
		
	});
	
})