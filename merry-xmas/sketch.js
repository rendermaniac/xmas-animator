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
let speed;
let message;
let coloured;
let repeat;

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
  
  rand = color(255, 255, 255);
  rgb = color(0, 0, 0);
  speed = 0.1;
  coloured = true;
  repeat = false;
  
  let a = [0, 1, 0, 1, 1, 1, 0]; // .-
  let e = [0, 1, 0]; // .
  let m = [0, 1, 1, 1, 0, 1, 1, 1, 0]; // --
  let o = [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0]; // ---
  let r = [0, 1, 0, 1, 1, 1, 0, 1, 0]; // .-.
  let s = [0, 1, 0, 1, 0, 1, 0]; // ...
  let x = [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0]; // -..-
  let y = [0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0]; // -.--
  let space = [0, 0, 0];
  
  message = [];
  message = concat(message, m);
  message = concat(message, e);
  message = concat(message, r);
  message = concat(message, r);
  message = concat(message, y);
  message = concat(message, space);
  message = concat(message, x);
  message = concat(message, m);
  message = concat(message, a);
  message = concat(message, s);
  message = concat(message, space);
  
  colors = new p5.Table();
  exported = false;
  
  // add headers
  colors.addColumn("FRAME_ID");
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    colors.addColumn("R_" + nf(i));
    colors.addColumn("G_" + nf(i));
    colors.addColumn("B_" + nf(i));
  }

  frames = int(message.length / speed);
  
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

  let x, y, z, j, f, bit;
  
  f = frameCount - 1;
  let anim = floor(f * speed);
  
  if ((f * speed) == anim && coloured)
    rand = color(int(random(255)), int(random(255)), int(random(255)));
  
  let index = repeat ? anim % message.length : anim;
  bit = message[index];
  
  rgb = color(red(rand) * bit, green(rand) * bit, blue(rand) * bit);
  
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
    
    j = i * 3;
    if (f < colors.getRowCount() && !exported) { 
      colors.setNum(f, j+1, red(rgb));
      colors.setNum(f, j+2, green(rgb));
      colors.setNum(f, j+3, blue(rgb));
    }
    
    push();
      translate(x * tree_scale, y * tree_scale, z * tree_scale);
      emissiveMaterial(red(rgb),green(rgb), blue(rgb));
      sphere(light_size);
    pop();
  
  }
  
  if (f == colors.getRowCount() && !exported) {
        print("exporting " + nf(frames));
        saveTable(colors, "morse-xmas-random.csv", "csv");
        exported = true;
    }
}