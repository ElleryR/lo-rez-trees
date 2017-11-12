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
    gradientIndex = 0
    trees = []
    tree_start_points = [];
    c1 = gradientColors['top'][gradientIndex]
    c2 = gradientColors['bottom'][gradientIndex]
    color1 = color(c1[0], c1[1], c1[2]);
    color2 = color(c2[0], c1[1], c1[2]);
    setGradient(0, 0, width, height, color2, color1);
    frameRate(240);
    addNewTree();
}

function draw() {
  if (frameCount % 120 == 0) {
    color1 = varyChannels(c1);
    color2 = varyChannels(c2);
  }
  setGradient(0, 0, width, height, color2, color1);
  for (var i=0; i<trees.length; i++) {
    trees[i].update();
    trees[i].update();
    trees[i].update();
    trees[i].display();
    if (frameCount % 60 == 0) {
      trees[i].fade();
    }
    if (trees[i].alpha == 0) {
      trees.splice(i, 1);
    }
  }
  if (frameCount % 240 == 0) {
    randomChance = int(random(3));
    if (randomChance == 1) {
      addNewTree();
    }
  }
}

function addNewTree(){
  new_tree = new recursiveTree()
  trees.push(new_tree)
  tree_start_points.push(new_tree.dest_branches[0][0])
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

function determineNewTreeX(startX, endX){
  dist = endX - startX;
  leftArea = [startX, (startX + (dist/2))]
  rightArea = [(endX - (dist/2)), endX]
  leftCount = 0;
  rightCount = 0;
  for (var i=0; i< this.tree_start_points.length; i++) {
    starting_point = tree_start_points[i];
    if (starting_point >= leftArea[0] && starting_point <= leftArea[1]) {
      leftCount++;
    } else if (starting_point >= rightArea[0] && starting_point <= rightArea[1]){
      rightCount++;
    }
  }
  if (leftCount == 0){
    return random(leftArea[0], leftArea[1]);
  } else if (rightCount == 0) {
    return random(rightArea[0], rightArea[1]);
  } else if (leftCount > rightCount){
    return determineNewTreeX(rightArea[0], rightArea[1])
  } else {
    return determineNewTreeX(leftArea[0], leftArea[1])
  }
}


function recursiveTree(){
  this.branches = [];
  this.dest_branches = [];
  this.alpha = 255;
  this.dest_x = 0;
  this.dest_y = 0;

  this.display = function() {
    stroke(color(255, 255, 255, this.alpha));
    strokeWeight(4);
    for (var i=0; i< this.branches.length; i++) {
      branch = this.branches[i];
      line(branch[0], branch[1], branch[2], branch[3]);
    }
  };

  this.set_new_branch = function(){
    if (this.dest_branches.length > 0) {
      new_branch = this.dest_branches.shift();
      this.dest_x = new_branch[2];
      this.dest_y = new_branch[3];
      new_branch[2] = new_branch[0];
      new_branch[3] = new_branch[1]
      this.branches.push(new_branch);
    }
  };

  this.update = function() {
    if (this.branches.length == 0){
      this.set_new_branch();
    }
    var last_index = this.branches.length - 1
    if (this.branches[last_index][2] < this.dest_x) {
      this.branches[last_index][2] = this.branches[last_index][2] + 0.25;
    }
    else if (this.branches[last_index][2] > this.dest_x) {
      this.branches[last_index][2] = this.branches[last_index][2] - 0.25;
    }
    if (this.branches[last_index][3] <= this.dest_y) {
      this.branches[last_index][3] = this.branches[last_index][3] + 0.25;
    }
    else if (this.branches[last_index][3] > this.dest_y) {
      this.branches[last_index][3] = this.branches[last_index][3] - 0.25;
    }
    if (int(this.dest_x) == int(this.branches[last_index][2]) && int(this.dest_y) == int(this.branches[last_index][3])){
      if (this.dest_branches.length > 0) {
        this.set_new_branch();
      }
    }
  };

  this.branchRecursive = function(x, y, angle, numBranches){
  //we want to stop recursing if our iterator is below 0
  if (numBranches <= 0) {
    return;
  }
  
  //try replacing random with noise
  //not comfortable with sin and cos yet? No problem! Try using rotate()
  //instead.
  var x2 = x + (cos(radians(angle)) * numBranches * 25.0) + random(-10,10);
  var x2 = float(parseFloat(x2).toFixed(2))
  var y2 = y + (sin(radians(angle)) * numBranches * 25.0) + random(-10,10);
  var y2 = float(parseFloat(y2).toFixed(2))
  this.dest_branches.push([x, y, x2, y2]);
  
  //we recurse on both side so that we have an even number of
  //branches.  What if we didn't have a symmetrical tree?
  this.branchRecursive(x2, y2, angle - 20, numBranches - 1);
  this.branchRecursive(x2, y2, angle + 20, numBranches - 1);
  }

  new_x = determineNewTreeX(0, windowWidth);
  this.branchRecursive(float(parseFloat(new_x).toFixed(2)), float(parseFloat(windowHeight).toFixed(2)), -90, 5);

}

recursiveTree.prototype.fade = function(){
  this.alpha = this.alpha - 3;
}


