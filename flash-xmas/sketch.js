let positions;
let colors;
let frames;

let light_size;
let tree_scale;

let origin_x;
let origin_y;
let origin_z;
let radius;
let rgb;

function insideSphere(x, y, z, x0, y0, z0, rad) {
  if (dist(x0, y0, z0, x, y, z) < rad)
    return true;
  return false;
}

function flash(x, y, z, duration, delay) {
  
  let on = radius - delay;
  let off = on - duration;
  
  rgb = color(0, 0, 0);
  if (insideSphere(x, y, z, 
                   origin_x, origin_y, origin_z, 
                   on))
    rgb = color(255, 0, 0);
  if (insideSphere(x, y, z, 
                   origin_x, origin_y, origin_z, 
                   off))
    rgb = color(0, 0, 0);
}

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
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
    
    flash(x, y, z, 1.0, 0.0);
    
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
  radius += 0.001 * frameCount;
}