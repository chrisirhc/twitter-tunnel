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
			    var json = {
			      id: "0",
			      name: "Faux Node",
			      data: {
			        "$alpha": 0
			      },
			      children: [
			        {
			        "id": "10aoeu",
			        name: "a",
			        data: {
			          "created_at": {
			            "datetime_gmt": "2011-03-13 05:31:32",
			            "unix_timestamp": 1299994292
			          }
			        },
			        "children": [
			          {
			          "id": "46809596156841984aoeu",
			          name: "b",
			          data: {
			            "created_at": {
			              "datetime_gmt": "2011-03-13 05:47:32",
			              "unix_timestamp": 1299995252
			            }
			          },
			          "children": [{
			            "id": "46814919412297728aoeu",
			            name: "c",
			            data: {
			                "created_at": {
			                "datetime_gmt": "2011-03-13 06:08:41",
			                "unix_timestamp": 1299996521
			              }
			            }
			          }]
			        },
			        {
			          "id": "46820113336385536aoeu",
			          data: {
			              "created_at": {
			              "datetime_gmt": "2011-03-13 06:29:19",
			              "unix_timestamp": 1299997759
			            }
			          }
			        },
			        {
			          "id": "46843301957083136aoeu",
			          data: {
			            "created_at": {
			              "datetime_gmt": "2011-03-13 08:01:28",
			              "unix_timestamp": 1300003288
			            }
			          },
			          "children": [
			            {
			            "id": "46849020584402944aoeu",
			            data: {
			              "created_at": {
			                "datetime_gmt": "2011-03-13 08:24:11",
			                "unix_timestamp": 1300004651
			              }
			            }
			          }
			          ]
			        }
			        ]
			      },
			        {
			      "id": "46805572842033152",
			      name: "a",
			      data: {
			        "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
			          "id": "46805572842033152",
			        "title": "Is @fakeraffles the pri sch secondary sch n jc all tgt in one acct??",
			        "content": "Is @fakeraffles the pri sch secondary sch n jc all tgt in one acct??",
			        "created_at": {
			          "datetime_gmt": "2011-03-13 05:31:32",
			          "unix_timestamp": 1299994292
			        },
			        "last_reply_at": {
			          "datetime_gmt": "2011-03-13 08:24:11",
			          "unix_timestamp": 1300004651
			        },
			        "stats": {
			          "total_mentions": 5,
			          "total_replies": 5,
			          "total_retweets": 0,
			          "distinct_users": 4,
			          "links": 1,
			          "images": 0
			        },
			        "user": {
			          "url": "http://twitoaster.com/country-sg/ellehcer/",
			            "id": "49662707",
			          "screen_name": "ellehcer",
			          "profile_image_url": "http://a1.twimg.com/profile_images/1232777914/63167_468808438994_550823994_5794846_845255_n_normal.jpg"
			        }
			      },
			      "children": [
			        {
			        "id": "46809596156841984",
			        name: "b",
			        data: {
			          "type": "reply",
			          "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46809596156841984",
			            "id": "46809596156841984",
			          "content": "@ellehcer Note: RGPS is in no way affiliated to the Raffles schools.",
			          "in_reply_to_status_id": "46805572842033152",
			          "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
			            "created_at": {
			            "datetime_gmt": "2011-03-13 05:47:32",
			            "unix_timestamp": 1299995252
			          },
			          "user": {
			            "url": false,
			            "id": "265103284",
			            "screen_name": "fakeRaffles",
			            "profile_image_url": "http://a1.twimg.com/profile_images/1270548621/Raffles_Institution_Coat_of_Arms_normal.png"
			          }
			        },
			        "children": [{
			          "id": "46814919412297728",
			          name: "c",
			          data: {
			            "type": "reply",
			            "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46814919412297728",
			              "id": "46814919412297728",
			            "content": "@fakeRaffles oh really. Oops sorry same name leh i not frm raffles how to know?",
			            "in_reply_to_status_id": "46809596156841984",
			            "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46809596156841984",
			              "created_at": {
			              "datetime_gmt": "2011-03-13 06:08:41",
			              "unix_timestamp": 1299996521
			            },
			            "user": {
			              "url": "http://twitoaster.com/country-sg/ellehcer/",
			                "id": "49662707",
			              "screen_name": "ellehcer",
			              "profile_image_url": "http://a1.twimg.com/profile_images/1232777914/63167_468808438994_550823994_5794846_845255_n_normal.jpg"
			            }
			          }
			        }]
			      },
			      {
			        "id": "46820113336385536",
			        data: {
			          "type": "reply",
			          "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46820113336385536",
			            "id": "46820113336385536",
			          "content": "@ellehcer help japan http://1goldblog.blogspot.com/search?upd...",
			            "in_reply_to_status_id": "46805572842033152",
			          "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
			            "created_at": {
			            "datetime_gmt": "2011-03-13 06:29:19",
			            "unix_timestamp": 1299997759
			          },
			          "user": {
			            "url": "http://twitoaster.com/digthegold/",
			              "id": "247338955",
			            "screen_name": "digthegold",
			            "profile_image_url": "http://a1.twimg.com/profile_images/1268379387/1000000497_normal.jpg"
			          }
			        }
			      },
			      {
			        "id": "46843301957083136",
			        data: {
			          "type": "reply",
			          "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46843301957083136",
			            "id": "46843301957083136",
			          "content": "@ellehcer no la it's fake sir Stamford raffles",
			          "in_reply_to_status_id": "46805572842033152",
			          "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/",
			            "created_at": {
			            "datetime_gmt": "2011-03-13 08:01:28",
			            "unix_timestamp": 1300003288
			          },
			          "user": {
			            "url": false,
			            "id": "252569439",
			            "screen_name": "MagNET92",
			            "profile_image_url": "http://a1.twimg.com/profile_images/1245139716/profpi_normal.jpg"
			          }
			        },
			        "children": [
			          {
			          "id": "46849020584402944",
			          data: {
			            "type": "reply",
			            "url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46849020584402944",
			              "id": "46849020584402944",
			            "content": "@MagNET92 ohhhhh. Okay but isn't he dead alr? Can't he be a real dead guy instd of pretending to be alive?",
			            "in_reply_to_status_id": "46843301957083136",
			            "in_reply_to_url": "http://twitoaster.com/country-sg/ellehcer/is-fakeraffles-the-pri-sch-secondary-sch-n-jc-all-tgt-in-one-acct/#comment-46843301957083136",
			              "created_at": {
			              "datetime_gmt": "2011-03-13 08:24:11",
			              "unix_timestamp": 1300004651
			            },
			            "user": {
			              "url": "http://twitoaster.com/country-sg/ellehcer/",
			                "id": "49662707",
			              "screen_name": "ellehcer",
			              "profile_image_url": "http://a1.twimg.com/profile_images/1232777914/63167_468808438994_550823994_5794846_845255_n_normal.jpg"
			            }
			          }
			        }
			        ]
			      }
			      ]
			}
			    ]
			    };
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
			   nearTime: 1300004651,
			   farTime: 1299986651,
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