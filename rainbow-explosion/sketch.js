let positions;
let colors;
let frames;

let light_size;
let tree_scale;

let origin_x;
let origin_y;
let origin_z;
let rgb;
let speed;

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
  
  origin_x = 0.0;
  origin_y = -1.0;
  origin_z = 0.0;
  
  rgb = color(0, 0, 0);
  speed = 0.1;
  
  colors = new p5.Table();
  exported = false;
  
  // add headers
  colors.addColumn("FRAME_ID");
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    colors.addColumn("R_" + nf(i));
    colors.addColumn("G_" + nf(i));
    colors.addColumn("B_" + nf(i));
  }

  frames = 500;
  
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

  let x, y, z, j, f, radius;
  f = frameCount - 1;
  
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);

    radius = dist(origin_x, origin_y, origin_z,
                  x, y, z);
    
    radius += 0.01 * frameCount;
    radius *= 200.0;
    
    colorMode(HSB);
    rgb = color(int(radius) % 360, 90, 100);
    colorMode(RGB);
    
    // debug code to find the origin
    //if (radius < 1.0)
    //  rgb = color(255, 0 ,0);
    //else
    //  rgb = color(0, 255,0);
    
    j = i * 3;
    if (f < colors.getRowCount() && !exported) { 
      colors.setNum(f, j+1, int(red(rgb)));
      colors.setNum(f, j+2, int(green(rgb)));
      colors.setNum(f, j+3, int(blue(rgb)));
    }
    
    push();
      translate(x * tree_scale, y * tree_scale, z * tree_scale);  
      emissiveMaterial(red(rgb),green(rgb), blue(rgb));
      sphere(light_size);
    pop();
  
  }
  
  if (f == colors.getRowCount() && !exported) {
        print("exporting " + nf(frames));
        saveTable(colors, "rainbow-explosion.csv", "csv");
        exported = true;
    }
}