
var branches = [];//holds a list of p5.Vectors
var trunkSize = 10.4;
var currentBranchLocL = null;
var currentBranchLocR = null;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  //translate(width/2, height/2);
  //if we have at least 2 items in our array
}

/**
 * when the user clicks the mouse,
 * add the mouse position as a vector to our branches
 * list
 * */
function mouseClicked(){
  // branchRecursive(mouseX, mouseY, -90, 10);
  superSimpleTreeDraw(mouseX,mouseY,-90,10);
}


function branchRecursive(x, y, angle, numBranches){
  //we want to stop recursing if our iterator is below 0
  if (numBranches <= 0) return;
  
  //try replacing random with noise
  //not comfortable with sin and cos yet? No problem! Try using rotate()
  //instead.
  var x2 = x + (cos(radians(angle)) * numBranches * 10.0) + random(-10,10);
  var y2 = y + (sin(radians(angle)) * numBranches * 10.0) + random(-10,10);
  console.log(x,y,x2,y2);
  line(x, y, x2, y2);
  
  //we recurse on both side so that we have an even number of
  //branches.  What if we didn't have a symmetrical tree?
  branchRecursive(x2, y2, angle - 20, numBranches - 1);
  branchRecursive(x2, y2, angle + 20, numBranches - 1);
}

/**
 * This function does not produce the same result as the recursive example
 * It's meant to demonstrate another way one can draw generative tree-like shapes
 * Note: there is no 1 correct answer to this problem.
 */
function superSimpleTreeDraw(x,y,angle, numBranches){
  var xL2, yL2;
  var xR2, yR2;
  var branchSize = 1.0;
  
  //we create an angleL and angleR so our tree can start
  //its growth vertically
  var angleL = angleR = angle;
  
  for(var i=0; i < numBranches; i++){
    if(i === 0){
      currentBranchLocL = createVector(x,y);
      currentBranchLocR = createVector(x,y);
      
      xL2 = currentBranchLocL.x;
      yL2 = currentBranchLocL.y;
      
      xR2 = currentBranchLocR.x;
      yR2 = currentBranchLocR.y;
    }
    else {
      //all branches other than the trunk lean in a direction
      angleL - 20.0;
      angleR + 20.0;
      
      // algorithm explanation:
      // take our branch location, and rotate by a given angle + a little random sway from-10 to 10
      xL2 = currentBranchLocL.x + (cos(radians(angleL)) * numBranches * branchSize * 20.0) + random(-10,10);
      yL2 = currentBranchLocL.y + (sin(radians(angleL)) * numBranches * branchSize * 20.0) + random(-10,10);
      xR2 = currentBranchLocR.x + (cos(radians(angleR)) * numBranches * branchSize *20.0) + random(-10,10); 
      yR2 = currentBranchLocR.y + (sin(radians(angleR)) * numBranches * branchSize * 20.0) + random(-10,10);
    }
    //draw our left branch
    line(currentBranchLocL.x, currentBranchLocL.y, xL2, yL2);
    //draw our right branch
    line(currentBranchLocR.x, currentBranchLocR.y, xR2, yR2);
    branchSize *= 0.66; //make each subsequent branch 2/3rds of the previous 
    currentBranchLocL = createVector(xL2, yL2);
    currentBranchLocR = createVector(xR2, yR2);
  }
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