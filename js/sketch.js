// Individual channels
var c1, c2;
// 2 main gradient colors
var color1, color2;
var gradientColors = {
	'top': [
    	[200, 102, 0],
    	[71, 133, 232]
	],
	'bottom': [
    	[0, 102, 153],
    	[255, 255, 255]
	]
}
var gradientIndex;


function setup() {
    createCanvas(windowWidth, windowHeight);
    // Define colors
    gradientIndex = 0
    c1 = gradientColors['top'][gradientIndex]
    c2 = gradientColors['bottom'][gradientIndex]
    color1 = color(c1[0], c1[1], c1[2]);
    color2 = color(c2[0], c1[1], c1[2]);
    frameRate(2);
}

function draw() {
    // Foreground
    color1 = varyChannels(c1);
    color2 = varyChannels(c2);
    setGradient(0, 0, width, height, color2, color1);
}

function setGradient(x, y, w, h, c1, c2) {
    noFill();
    // Top to bottom gradient
    for (var i = y; i <= y+h; i++) {
        var inter = map(i, y, y+h, 0, 1);
        var c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x+w, i);
    }
}

function varyChannels(colorArray) {
	for (var i = 0; i < colorArray.length; i++) {
		colorArray[i] = colorArray[i] + random(-3, 3);
	}
	return color(colorArray[0], colorArray[1], colorArray[2]);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {

    switch (key) {
        case 'F':
            var fs = fullscreen();
            fullscreen(!fs);
            break; 
        case 'C':
        	gradientIndex++;
        	if (gradientIndex == gradientColors['top'].length) {
        		gradientIndex = 0;
        	}
     		c1 = gradientColors['top'][gradientIndex]
    		c2 = gradientColors['bottom'][gradientIndex]       	
    }
}
