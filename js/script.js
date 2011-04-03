/* Author: 

*/


g = new Dygraph(
	document.getElementById("graphdiv"),  // containing div
	"1,12\n" +
	"2,28\n" +
	"3,32\n" +
	"4,41\n" +
	"5,23\n" +
	"6,27\n" +
	"7,17\n" +
	"8,27\n" +
	"9,77\n" +
	"10,23\n" +
	"11,24\n" +
	"12,58\n",
	{
		width: 700,
		height: 70,
		labels: [ "Date", "Tweets" ],
		axisLabelFontSize: 10,
		labelsDivWidth: 120,
		labelsDivStyles: {
	        'background-color': 'transparent',
	        'font-size': '10px',
			'text-align': 'right'
		},
	}
);

function unzoomGraph() {
	g.updateOptions({
		dateWindow: null,
		valueRange: null
	});
}




















