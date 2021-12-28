let positions;
let colors;

let light_size;
let tree_scale;

function preload() {
  positions = loadTable("https://raw.githubusercontent.com/standupmaths/xmastree2021/main/coords_2021.csv", "csv");
  colors = loadTable("morse-xmas-random.csv", "csv", "header");
}

function setup() {
  createCanvas(500, 500, WEBGL);

  light_size = 3;
  tree_scale = 100;
}

function draw() {
  
  background(0);
  orbitControl();
  translate(0, 100, 0);

  normalMaterial();

  let x, y, z, r, g, b, j;
  let currentFrame = frameCount % (colors.getRowCount() -1);

  for (let i = 0; i < positions.getRowCount(); i++) {

    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);

    j = i * 3;
    r = colors.getNum(currentFrame, j + 1);
    g = colors.getNum(currentFrame, j + 2);
    b = colors.getNum(currentFrame, j + 3);

    push();
    translate(x * tree_scale, y * tree_scale, z * tree_scale);
    emissiveMaterial(r, g, b);
    sphere(light_size);
    pop();
  
  }
}