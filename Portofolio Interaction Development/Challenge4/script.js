let ball;
let maze;
let goal;
let statusP;

function setup() {
  createCanvas(400, 400);
  ball = new Ball();
  maze = new Maze();
  goal = new Goal();
  statusP = createP('');
  statusP.id('status');
}

function draw() {
  background(220);
  maze.display();
  ball.update();
  ball.display();
  goal.display();

  if (ball.reaches(goal)) {
    noLoop();
    statusP.html('You reached the goal!');
  }
}

function deviceMoved() {
  ball.setAcceleration(rotationY * 0.05, rotationX * 0.05);
}

class Ball {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.size = 20;
    this.xSpeed = 0;
    this.ySpeed = 0;
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Boundary checking
    this.x = constrain(this.x, 0, width - this.size);
    this.y = constrain(this.y, 0, height - this.size);

    // Maze collision checking
    if (maze.collides(this)) {
      this.x -= this.xSpeed;
      this.y -= this.ySpeed;
    }
  }

  display() {
    fill(0, 0, 255);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }

  setAcceleration(xAcc, yAcc) {
    this.xSpeed = xAcc;
    this.ySpeed = yAcc;
  }

  reaches(goal) {
    let d = dist(this.x, this.y, goal.x, goal.y);
    return d < (this.size + goal.size) / 2;
  }
}

class Maze {
  constructor() {
    this.walls = [
      { x1: 100, y1: 0, x2: 100, y2: 300 },
      { x1: 400, y1: 300, x2: 400, y2: 300 },
      // Add more walls as needed
    { x1: 150, y1: 200, x2: 300, y2: 200 },
    { x1: 200, y1: 20, x2: 200, y2: 300 },
    { x1: 250, y1: 0, x2: 250, y2: 200 },
    { x1: 0, y1: 350, x2: 150, y2: 350 },
    ];

  }

  display() {
    stroke(0);
    strokeWeight(2);
    for (let wall of this.walls) {
      line(wall.x1, wall.y1, wall.x2, wall.y2);
    }
  }

  collides(ball) {
    for (let wall of this.walls) {
      if (ball.x > wall.x1 && ball.x < wall.x2 && ball.y > wall.y1 && ball.y < wall.y2) {
        return true;
      }
    }
    return false;
  }
}

class Goal {
  constructor() {
    this.x = 350;
    this.y = 350;
    this.size = 30;
  }

  display() {
    fill(0, 255, 0);
    noStroke();
    ellipse(this.x, this.y, this.size);
  }
}
