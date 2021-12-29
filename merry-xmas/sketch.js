let positions;
let colors;
let frames;

let light_size;
let tree_scale;

let rand;
let rgb;

let message;

let speed;
let coloured;
let repeat;
let twinkle;
let save_file;

let offsets;
let offsets_color;
let previous_bits;

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
  previous_bit = 0;
  
  // these control the final pattern
  speed = 0.1;
  coloured = true;
  repeat = true;
  twinkle = true;
  save_file = true;
  
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
  
  offsets = [];
  offsets_color = [];
  previous_bits = [];
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    colors.addColumn("R_" + nf(i));
    colors.addColumn("G_" + nf(i));
    colors.addColumn("B_" + nf(i));
    
    offsets.push(int(random(i)));
    
    offsets_color.push(color(int(random(i)) % 255,
                             int(random(i)) % 255,
                             int(random(i)) % 255));
    
    previous_bits.push(0);
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
    
  let index = repeat ? anim % message.length : anim;
  
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
    
    if (twinkle) {
      index += offsets[i];
      index = index % message.length;
      rand = offsets_color[i];
    }
    
    bit = message[index];
    
    if (bit == 1 && previous_bits[i] == 0 && coloured)
      rand = color(int(random(255)), int(random(255)), int(random(255)));
    
    previous_bits[i] = bit;
    
    rgb = color(red(rand) * bit,
                green(rand) * bit,
                blue(rand) * bit);
    
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
      if (save_file) {
        print("exporting " + nf(frames));
        saveTable(colors, "morse-xmas-twinkle.csv", "csv");
      }
      exported = true;
    }
}