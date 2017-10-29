var c1, c2;

function getWidth() {
  return Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.documentElement.clientWidth
  );
}

function getHeight() {
  return Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.documentElement.clientHeight
  );
}

function setup() {
  createCanvas(getWidth(), getHeight());

  // Define colors
  c1 = color(200, 102, 0);
  c2 = color(0, 102, 153);
  noLoop();
}

function draw() {
  // Foreground
  setGradient(0, 0, width, height, c2, c1);
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