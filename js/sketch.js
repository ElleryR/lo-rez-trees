// Individual channels
var c1, c2;

// 2 main gradient colors
var color1, color2;
var time;
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
	rectMode(CENTER);
    ellipseMode(CENTER);

    trees = [];
    tree_start_points = [];

	gradientIndex = 0;
    c1 = gradientColors['top'][gradientIndex];
    c2 = gradientColors['bottom'][gradientIndex];
    color1 = color(c1[0], c1[1], c1[2]);
    color2 = color(c2[0], c1[1], c1[2]);
    setGradient(0, 0, width, height, color2, color1);
    frameRate(240);
    addNewTree();
}

function draw() {

    //if (frameCount % 120 == 0) {
        color1 = varyChannels(c1);
        color2 = varyChannels(c2);
    //}

    setGradient(0, 0, width, height, color2, color1);

    for (var i = 0; i < trees.length; i++) {
        trees[i].update();

        trees[i].display();

        if (frameCount % 20 == 0) {
            trees[i].fade();
        }
        if (trees[i].alpha == -100) {
            trees.splice(i, 1);
            console.log('removed tree');
        }
        if (trees[i].alpha < 80) {
            trees[i].moveDown();
        }

    }

    if (frameCount % 240 == 0) {
        randomChance = int(random(3));
        if (randomChance == 1) {
            addNewTree();
        }
    }

}

function addNewTree() {
    new_tree = new recursiveTree();
    trees.push(new_tree);
    tree_start_points.push(new_tree.dest_branches[0][0]);
}

function setGradient(x, y, w, h, c1, c2) {
    noFill();
    // Top to bottom gradient
    for (var i = y; i <= y + h; i++) {
        var inter = map(i, y, y + h, 0, 1);
        var c = lerpColor(c1, c2, inter);
        stroke(c);
        line(x, i, x + w, i);
    }
}

var phase = 0;
var dir = 1;
function varyChannels(colorArray) {
    let addr = 0.0005;
    let noiseScale = 80; //increase the spread of color change
    phase += addr * dir;
    if (phase > 1000 || phase < 0) {
        dir *= -1;
    }
    let newR = int(colorArray[0] + ((noise(phase)*noiseScale) - noiseScale/2));
    let newG = int(colorArray[1] + ((noise(phase* 1.1)*noiseScale) - noiseScale/2));
    let newB = int(colorArray[2] + ((noise(phase* 1.4)*noiseScale) - noiseScale/2));

    return color(newR, newG, newB);
}


function determineNewTreeX(startX, endX) {
    dist = endX - startX;
    leftArea = [startX, (startX + (dist / 2))]
    rightArea = [(endX - (dist / 2)), endX]
    leftCount = 0;
    rightCount = 0;

    for (var i = 0; i < this.tree_start_points.length; i++) {

        starting_point = tree_start_points[i];
        if (starting_point >= leftArea[0] && starting_point <= leftArea[1]) {
            leftCount++;
        } else if (starting_point >= rightArea[0] && starting_point <= rightArea[1]) {
            rightCount++;
        }

    }

    if (leftCount == 0) {
        return random(leftArea[0], leftArea[1]);
    } else if (rightCount == 0) {
        return random(rightArea[0], rightArea[1]);
    } else if (leftCount > rightCount) {
        return determineNewTreeX(rightArea[0], rightArea[1])
    } else {
        return determineNewTreeX(leftArea[0], leftArea[1])
    }
}


function recursiveTree() {
    var breeze = 0.0;
    var breezeAddr = 0.001;
    this.nodes = [];

    this.branches = [];
    this.dest_branches = []; //hold the start and end points of each branch as it is made
    this.alpha = 255;
    this.dest_x = 0; //the final x location of the branch
    this.dest_y = 0; //the final y location "   "    " "
    this.move = 1;

    this.nodeRaise = 1;
    this.nodeX = 1;
    this.nodeAlpha = 255;

    this.moveDown = function() {
        this.move = this.move + 0.0005;
        this.nodeRaise = this.nodeRaise - 0.2;
        this.nodeX = this.nodeX + 0.05;
        //this.nodeAlpha = this.nodeAlpha - 2;
    }

    this.sway = function() {
        for (var i= 2; i < this.branches.length; i++) {
            var b = this.branches[i];
            var bMinus = this.branches[i-1];

            b[0] = b[0] + (noise(time + TWO_PI) - 0.5);
            b[1] = b[1] + (noise(time - TWO_PI) - 0.5);
            bMinus[3] = bMinus[3] + (noise(time + TWO_PI) - 0.5);
            bMinus[2] = bMinus[2] + (noise(time + TWO_PI) - 0.5);

        }
    }

    this.display = function() {

        stroke(color(255, 255, 255, this.alpha));
        strokeWeight(4);
        for (var i = 0; i < this.branches.length; i++) {
            branch = this.branches[i];

            push();
            scale(1.0,this.move);
            line(branch[0], branch[1], branch[2], branch[3]);
            pop();
            if (branch[4] == true) {
                noFill();
                strokeWeight(3);

                push();
                scale(1.0, this.move);
                ellipse(branch[2], branch[3]-3, 8);
                pop();

            } else {
                fill(255, this.nodeAlpha);

                rect(branch[2]+ (this.nodeX * branch[5]), branch[3] + (this.nodeRaise * branch[6]), 1, 2);
            }
        }
    };


    this.set_new_branch = function() {

        if (this.dest_branches.length > 0) {
            new_branch = this.dest_branches.shift();
            this.dest_x = new_branch[2];
            this.dest_y = new_branch[3];
            new_branch[2] = new_branch[0];
            new_branch[3] = new_branch[1];
            this.branches.push(new_branch);
        }

    };

    this.update = function() {

        if (this.branches.length == 0) {
            this.set_new_branch();
        }

        var last_index = this.branches.length - 1;

        if (this.branches[last_index][2] < this.dest_x) {
            this.branches[last_index][2] = this.branches[last_index][2] + 0.5;
        } else if (this.branches[last_index][2] > this.dest_x) {
            this.branches[last_index][2] = this.branches[last_index][2] - 0.5;
        }

        if (this.branches[last_index][3] < this.dest_y) {
            this.branches[last_index][3] = this.branches[last_index][3] + 0.5;
        } else if (this.branches[last_index][3] > this.dest_y) {
            this.branches[last_index][3] = this.branches[last_index][3] - 0.5;
        }

        if (Math.round(this.dest_x) == Math.round(this.branches[last_index][2]) && Math.round(this.dest_y) == Math.round(this.branches[last_index][3])) {
            if (this.dest_branches.length > 0) {
                this.set_new_branch();
				//happy mistake
				//pulse every time we sprout a new branch
				noFill();
				stroke(0, 255, 25);
				ellipse(int(this.branches[last_index][2]), int(this.branches[last_index][3]), 10);
            }

        }

    };

    this.branchRecursive = function(x, y, angle, numBranches) {
        if (numBranches <= 0) {
            return;
        }

        var x2 = x + (cos(radians(angle)) * numBranches * 20.0) + random(-10, 10);
        var x2 = Math.round(parseFloat(x2).toFixed(2))
        var y2 = y + (sin(radians(angle)) * numBranches * 20.0) + random(-10, 10);
        var y2 = Math.round(parseFloat(y2).toFixed(2))

        var terminal = numBranches == 1;
        var nodeXSpeed= random(-1, 1);
        var nodeYSpeed = random(0.01, 1);
        this.dest_branches.push([x, y, x2, y2, terminal, nodeXSpeed,nodeYSpeed]);
        this.branchRecursive(x2, y2, angle - 25, numBranches - 1);
        this.branchRecursive(x2, y2, angle + 25, numBranches - 1);

    }

    new_x = determineNewTreeX(0, windowWidth);

    this.branchRecursive(Math.round(parseFloat(new_x).toFixed(2)), Math.round(parseFloat(windowHeight).toFixed(2)), -90, floor(random(3, 8)));

}

recursiveTree.prototype.fade = function() {
    this.alpha = this.alpha - 1;

}

//==========================================================
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
			break;
    }

}
