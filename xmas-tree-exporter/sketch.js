let positions;
let colors;
let frames;

let light_size;
let tree_scale;

function getColor(x, y, z, f) {
  let a = int((y + (0.01 * f)) * 255) % 255;
  return [a, a, a];
}

function preload() {
  positions = loadTable("https://raw.githubusercontent.com/standupmaths/xmastree2021/main/coords_2021.csv", "csv");
}

function setup() {
  createCanvas(500, 500, WEBGL);

  light_size = 3;
  tree_scale = 100;
  frames = 100;
  
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

  let x, y, z, rgb, j, f;
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);

    rgb = getColor(x, y, z, frameCount);
    
    j = i * 3;
    f = frameCount % frames;
    colors.setNum(f, j+1, rgb[0]);
    colors.setNum(f, j+2, rgb[1]);
    colors.setNum(f, j+3, rgb[2]);
    
    push();
    translate(x * tree_scale, y * tree_scale, z * tree_scale);
    emissiveMaterial(rgb[0], rgb[1], rgb[2]);
    sphere(light_size);
    pop();
  
  }
}