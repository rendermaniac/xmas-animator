let positions;
let colors;
let frames;

let light_size;
let tree_scale;

let origin_x;
let origin_y;
let origin_z;
let rand;
let rgb;

function preload() {
  positions = loadTable("https://raw.githubusercontent.com/standupmaths/xmastree2021/main/coords_2021.csv", "csv");
}

function setup() {
  createCanvas(500, 500, WEBGL);

  light_size = 3;
  tree_scale = 100;
  frames = 100;
  
  origin_x = 0.0;
  origin_y = -1.0;
  origin_z = 0.0;
  radius = 0.0;
  rand = color(255, 255, 255);
  rgb = color(0, 0, 0);
  
  colors = new p5.Table();
  
  // add headers
  colors.addColumn("FRAME_ID");
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    colors.addColumn("R_" + nf(i));
    colors.addColumn("G_" + nf(i));
    colors.addColumn("B_" + nf(i));
  }

  // initialize frame id
  for (let i = 0; i < frames; i++) {
    colors.addRow()
    colors.setNum(i, 0, i);
  }
  
  exportBtn = createButton("Export CSV");
  exportBtn.mousePressed(exportCSV);
}

function exportCSV() {
  saveTable(colors, "lights.csv", "csv");
}

function draw() {
  
  background(0);
  orbitControl();
  translate(0, 100, 0);
  normalMaterial();

  let x, y, z, j, f;

  let speed = 0.01;
  
  let anim = abs(sin(PI * speed * frameCount));
  if (frameCount % (1.0/speed) == 0.0)
    rand = color(random(255),
                random(255),
                random(255));
  
  rgb = color(red(rand) * anim,
              green(rand) * anim,
              blue(rand) * anim);
  
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
    
    j = i * 3;
    f = frameCount % frames;
    colors.setNum(f, j+1, red(rgb));
    colors.setNum(f, j+2, green(rgb));
    colors.setNum(f, j+3, blue(rgb));
    
    push();
    translate(x * tree_scale, y * tree_scale, z * tree_scale);
    emissiveMaterial(red(rgb),green(rgb), blue(rgb));
    sphere(light_size);
    pop();
  
  }
}