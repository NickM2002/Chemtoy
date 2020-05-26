// Ported from original Metaball script by SATO Hiroyuki
// http://park12.wakwak.com/~shp/lc/et/en_aics_script.html

project.currentStyle = {
	fillColor: 'black'
};

// Background
var rect = new Path.Rectangle({
    point: [0, 0],
    size: [window.innerWidth, window.innerHeight],
    fillColor: '#bebdb8',
    selected: true
});

rect.sendToBack();


// Carbon atom

var circlePaths = [];

var largeCircle = new Path.Circle({
    center: [676, 433],
    fillColor: 'black',
	radius: 70
});

circlePaths.push(largeCircle);


function onMouseMove(event) {
	largeCircle.position = event.point;
	largeCircle.bringToFront()
	generateConnections(circlePaths);
}

function onMouseDown(event) {
	var distances = []
	for (var i = 0, l = circlePaths.length; i < l; i++) {
			var d = Math.round(event.point.getDistance(circlePaths[i].position))
			if(d < 300 && d != 0){
				distances.push(d)
		}
	}
	var circlePath = new Path.Circle({
        center: event.point,
        fillColor: 'white',
		radius: 50
	});
	circlePaths.push(circlePath);
	var text = new PointText(event.point);

	text.content = distances.toString();
	text.style = {
		fontFamily: 'Courier New',
		fontWeight: 'bold',
		fontSize: 20,
		fillColor: 'red',
		justification: 'center'
	};
}

// Bonding

var connections = new Group();
function generateConnections(paths) {
	// Remove the last connection paths:
	connections.children = [];

	for (var i = 0, l = paths.length; i < l; i++) {
		for (var j = i - 1; j >= 0; j--) {
			var path = metaball(paths[i], paths[j], 0.5, 2.0, 300);
			if (path) {
				connections.appendTop(path);
				path.removeOnMove();
			}
		}
	}
}

generateConnections(circlePaths);

function bondstrenghcolor(d){
	var red = ((255*(d/300))).toString(16)
	return red.slice(0,2)+'1111'
}

// ---------------------------------------------
function metaball(ball1, ball2, v, handle_len_rate, maxDistance) {
	var center1 = ball1.position;
	var center2 = ball2.position;
	var radius1 = ball1.bounds.width / 2;
	var radius2 = ball2.bounds.width / 2;
	var pi2 = Math.PI / 2;
	var d = center1.getDistance(center2);
	var u1, u2;

	if (radius1 == 0 || radius2 == 0)
		return;

	if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
		return;
	} else if (d < radius1 + radius2) { // case circles are overlapping
		u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
				(2 * radius1 * d));
		u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
				(2 * radius2 * d));
	} else {
		u1 = 0;
		u2 = 0;
	}

	var angle1 = (center2 - center1).getAngleInRadians();
	var angle2 = Math.acos((radius1 - radius2) / d);
	var angle1a = angle1 + u1 + (angle2 - u1) * v;
	var angle1b = angle1 - u1 - (angle2 - u1) * v;
	var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
	var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
	var p1a = center1 + getVector(angle1a, radius1);
	var p1b = center1 + getVector(angle1b, radius1);
	var p2a = center2 + getVector(angle2a, radius2);
	var p2b = center2 + getVector(angle2b, radius2);

	// define handle length by the distance between
	// both ends of the curve to draw
	var totalRadius = (radius1 + radius2);
	var d2 = Math.min(v * handle_len_rate, (p1a - p2a).length / totalRadius);

	// case circles are overlapping:
	d2 *= Math.min(1, d * 2 / (radius1 + radius2));

	radius1 *= d2;
	radius2 *= d2;

	var path = new Path({
		segments: [p1a, p2a, p2b, p1b],
		style: ball1.style,
		fillColor: '#'+bondstrenghcolor(d),
		closed: true
	});

	var segments = path.segments;
	segments[0].handleOut = getVector(angle1a - pi2, radius1);
	segments[1].handleIn = getVector(angle2a + pi2, radius2);
	segments[2].handleOut = getVector(angle2b - pi2, radius2);
	segments[3].handleIn = getVector(angle1b + pi2, radius1);
	return path;
}

// ------------------------------------------------
function getVector(radians, length) {
	return new Point({
		// Convert radians to degrees:
		angle: radians * 180 / Math.PI,
		length: length
	});
}