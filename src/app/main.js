function setup() {

  randomSeed(R.seed);
  noiseSeed(R.seed);

  let dim = min(window.innerWidth, window.innerHeight);
  createCanvas(dim, dim);

  colorMode(RGB, 1);
  noStroke();
  background(1,0.8,0.8);

}

function draw() {

  if (ballPosition[0] < 0 || ballPosition[0] > width) ballDirection[0] = -ballDirection[0];
  if (ballPosition[1] < 0 || ballPosition[1] > height) ballDirection[1] = -ballDirection[1];

  ballPosition[0] += ballDirection[0];
  ballPosition[1] += ballDirection[1];

  fill(0);
  circle(...ballPosition, featureSeeds.radius);
  
}