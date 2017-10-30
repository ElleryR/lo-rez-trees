var c1, c2;

function setup() {
    createCanvas(windowWidth, windowHeight);
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {

    switch (key) {
        case 'F':
            console.log("meh");
            var fs = fullscreen();
            fullscreen(!fs);
            break;
    }
}
