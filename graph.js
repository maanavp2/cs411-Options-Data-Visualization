var chart = null;
var times = []; // times is an array of time
var data;  // data is an array [ {field: ..., data: [{...}]}, {...} ...]
var scale = 0; // the length of displayed part of time labels
var len = 0; // the total length of labels
var left = []; // labels that are zoomed out
var right = []; // or moved out of sight

var isExpDateUpdated = false;
var isStrikeUpdated = false;

var legendClickHandler = function(e, legendItem) {
	let index = legendItem.datasetIndex;
	let ci = this.chart;
	let meta = ci.getDatasetMeta(index);
	meta.hidden = meta.hidden === null ?
		!ci.data.datasets[index].hidden : null;
	ci.options.scales.yAxes[index].display =
		!ci.options.scales.yAxes[index].display;
	ci.update();
}
// need to implement the removal of the child of expiration date and strike
// so it can clear the suggestion box
function getData() {
	if (chart != null) {
		chart.destroy();
	}
	times=[]; data=[]; left=[]; right=[]; scale=0; len=0;
	isUpdated=false; isStrikeUpdated=false;
	var form = document.getElementById('frm');
	var link = "http://18.220.144.204:5000/data?symbol="+form['symbol'].value+
		"&strike="+form['strike'].value+
		"&expiration_date="+form['exp_date'].value+
		"&type="+form['type'].value;
	var request = new XMLHttpRequest();
	request.open("GET", link)
	request.send();
	request.onload = function(e) {
		if (request.status == 200) {
			let response = JSON.parse(request.response);
			times = response['time'];
			data = response['data'];
			left = []; right = [];
			scale = times.length;
			len = scale;
			draw();
		} else {
			alert(request.response);
			return;
		}
	}
}

function draw() {
	var datasets = [];
	var y = [];
	data.forEach((entry) => {
		let color = 'rgb('+
			Math.floor(Math.random()*256)+','+
			Math.floor(Math.random()*256)+','+
			Math.floor(Math.random()*256);
		let element = {
			label: entry.field,
			yAxisID: entry.field,
			borderColor: color+')',
			backgroundColor: color+',0)',
			data: entry.data,
			type: 'line',
			hidden: true
		};
		let yElement = {
			id: entry.field,
			type: 'linear',
			display: false,
			position: Math.random() < 0.5 ? 'left' : 'right',
			ticks: {
				fontColor: color+')'
			}
		}
		datasets.push(element);
		y.push(yElement);
	})
	drawHelper(datasets, y);
}

function drawHelper(datas, y) {	
	var ctx = document.getElementById('myChart').getContext('2d');
	chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: times,
			datasets: datas,
		},
		options: {
			scales: {
				xAxes: [{
					type: 'time',
					distribution: 'series',
					time: {
						unit: 'minute'
					},
					bounds: 'ticks',
					ticks: {
						source: 'labels'
					}
				}],
				yAxes: y
			},
			legend: {
				onClick: legendClickHandler
			},
			layout: {
				padding: {
					left: 10,
					right: 10,
					top: 0,
					bottom: 10
				}
			}
		}
	})
}

var isLeft = true;
function zoom(e) {
	if (scale == 0) { return; } // the graph is not drawn yet
	e.preventDefault();
	let prev = scale;
	scale += Math.round(e.deltaY * 0.01 * times.length);
	scale = Math.max(Math.min(len, scale), 2);
	let diff = scale - prev;
	//console.log(prev, scale, diff);
	while (times.length > 2 && diff < 0) {
		if (isLeft) {
			left.push(times.shift());
		} else {
			right.unshift(times.pop());
		}
		++diff;
		isLeft = !isLeft;
	}
	while (diff > 0) {
		if (right.length > 0 && isLeft) {
			times.push(right.shift());
		} else if (left.length > 0)  {
			times.unshift(left.pop());
		}
		isLeft = !isLeft;
		--diff;
	}
	chart.update(0.2);
}

var isMouseDown = false;
var prevX = 0;
var prevT = 0;
function mouseDown(e) {
	isMouseDown = true;
	prevX = e.clientX;
	prevT = Date.now();
}
function mouseUp() {
	isMouseDown = false;
}
function mouseMove(e) {
	if (isMouseDown) {
		let currX = e.clientX;
		let dx = currX - prevX;
		let t = Date.now();
		let dt = t - prevT;
		let v = Math.round(dx/dt*5);
		prevX = currX;
		prevT = t;
		while (right.length > 0 && v < 0) {
			times.push(right.shift());
			left.push(times.shift());
			++v;
		}
		while (left.length > 0 && v > 0) {
			times.unshift(left.pop());
			right.unshift(times.pop());
			--v;
		}
		chart.update(1);
	}
}

// function getExpirationDate() {
// 	console.log('date');
// 	let datalist = document.getElementById('exp_d');
// 	let form = document.getElementById('frm');
// 	let symbol = form['symbol'].value;
// 	if (symbol.length < 3 || isExpDateUpdated) { return; }
// 	let request = new XMLHttpRequest();
// 	request.open("GET",
// 		'http://127.0.0.1:5000/expiration_date?symbol='+symbol);
// 	request.send();
// 	request.onload = function(e) {
// 		if (request.status == 200) {
// 			isExpDateUpdated = true;
// 			let response = JSON.parse(request.response);
// 			for (const i in response) {
// 				let opt = document.createElement('option');
// 				opt.appendChild(document.createTextNode(response[i]));
// 				datalist.appendChild(opt);
// 			}
// 		}
// 	}
// }

// function getStrikePrice() {
// 	console.log('price');
// 	let datalist = document.getElementById('price');
// 	let form = document.getElementById('frm');
// 	let symbol = form['symbol'].value;
// 	let exp_date = form['exp_date'].value;
// 	if (!isExpDateUpdated || isStrikeUpdated) { return; }
// 	let request = new XMLHttpRequest();
// 	request.open("GET",
// 		'http://127.0.0.1:5000/strike_price?symbol='+symbol+
// 		'&expiration_date='+exp_date);
// 	request.send();
// 	request.onload = function(e) {
// 		if (request.status == 200) {
// 			let response = JSON.parse(request.response);
// 			if (response == null) { console.log('null'); return; }
// 			isStrikeUpdated = true;
// 			for (const i in response) {
// 				let opt = document.createElement('option');
// 				opt.appendChild(document.createTextNode(response[i]));
// 				datalist.appendChild(opt);
// 			}
// 		}
// 	}
// }

// function removeSuggestions() {
// 	let exp_date = document.getElementById('exp_d');
// 	let price = document.getElementById('price');
// 	exp_date_child = exp_date.firstChild;
// 	price_child = price.firstChild;
// 	while (exp_date_child) {
// 		console.log('remove')
// 		exp_date.removeChild(exp_date_child);
// 		exp_date_child = exp_date.firstChild;
// 	}
// 	while (price_child) {
// 		price.removeChild(price_child);
// 		price_child = price.firstChild;
// 	}
// 	isExpDateUpdated = false; isStrikeUpdated = false;
// }
