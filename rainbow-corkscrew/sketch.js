let positions;
let colors;
let frames;

let light_size;
let tree_scale;

let rand;
let rgb;

let speed;
let save_file;

let exported;

function preload() {
  positions = loadTable("https://raw.githubusercontent.com/standupmaths/xmastree2021/main/coords_2021.csv", "csv");
}

function setup() {
  createCanvas(500, 500, WEBGL);

  let fps = 60;
  frameRate(fps);
  
  light_size = 3;
  tree_scale = 100;
  
  rgb = color(0, 0, 0);
  
  // these control the final pattern
  speed = 2.0;
  save_file = true;
  
  colors = new p5.Table();
  exported = false;
  
  // add headers
  colors.addColumn("FRAME_ID");
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    colors.addColumn("R_" + nf(i));
    colors.addColumn("G_" + nf(i));
    colors.addColumn("B_" + nf(i));
  }

  preroll = 720;
  frames = 360;
  
  for (let j = 0; j < frames; j++) {
    colors.addRow();
    colors.setNum(j, 0, j);
  } 
}

function draw() {
  
  background(0);
  orbitControl();
  translate(0, 100, 0);
  normalMaterial();

  let x, y, z, angle, j, f;
  
  f = frameCount - 1;
  let anim = floor(f * speed);
  
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
    
    angleMode(DEGREES);
    angle = atan2(z, x) + 180.0;
    angle += 400.0 * y;
    angle += speed * frameCount;
    angleMode(RADIANS);
    
    colorMode(HSL);
    rgb = color(angle % 360.0, 80, 50);
    colorMode(RGB);
    
    j = i * 3;
    if (f >= preroll && f < (preroll + frames) && !exported) { 
      colors.setNum(f-preroll, j+1, int(red(rgb)));
      colors.setNum(f-preroll, j+2, int(green(rgb)));
      colors.setNum(f-preroll, j+3, int(blue(rgb)));
    }
    
    push();
      translate(x * tree_scale, y * tree_scale, z * tree_scale);
      emissiveMaterial(red(rgb),green(rgb), blue(rgb));
      sphere(light_size);
    pop();
  
  }
  
  if (f == (preroll + frames) && !exported) {
      if (save_file) {
        print("exporting " + nf(frames));
        saveTable(colors, "rainbow-corkscrew.csv", "csv");
      }
      exported = true;
    }
}