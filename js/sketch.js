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
    setGradient(0, 0, width, height, color2, color1);
}

function draw() {
	if (frameCount % 10 == 0) {
		color1 = varyChannels(c1);
        color2 = varyChannels(c2);
        setGradient(0, 0, width, height, color2, color1);
	}
    if (frameCount % 5 == 0) {
		stroke(color(255, 255, 255));
  		branchRecursive(random(windowWidth), windowHeight, -90, 5);
    }
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

function mouseClicked(){
	stroke(color(255, 255, 255));
  	branchRecursive(random(windowWidth), windowHeight, -90, 5);
}


function branchRecursive(x, y, angle, numBranches){
  //we want to stop recursing if our iterator is below 0
  if (numBranches <= 0) return;
  
  //try replacing random with noise
  //not comfortable with sin and cos yet? No problem! Try using rotate()
  //instead.
  var x2 = x + (cos(radians(angle)) * numBranches * 10.0) + random(-10,10);
  var y2 = y + (sin(radians(angle)) * numBranches * 10.0) + random(-10,10);
  line(x, y, x2, y2);
  
  //we recurse on both side so that we have an even number of
  //branches.  What if we didn't have a symmetrical tree?
  branchRecursive(x2, y2, angle - 20, numBranches - 1);
  branchRecursive(x2, y2, angle + 20, numBranches - 1);
}

/**
 * What if you chose a random branch left or right?
 * based on the random boolean example in class.
 * See week04 example as reference.
 * this function returns either our right side or left side coords
 * as a vector.  It should be randomly choosing which side;
 */
function randomLeftOrRight(x1,y1, x2, y2){
  var bTruth = Math.round(random(1));
  if(bTruth == 1){
    var vecLeft = createVector(x1,y1);
    return vecLeft;
  } else {
    var vecRight = createVector(x2,y2);
    return vecRight;
  }
}
