let positions;
let colors;
let frames;

let light_size;
let tree_scale;

let bb;
let offsets;
let start_color;
let end_color;
let start_color_original;
let end_color_original;
let rgb;

let speed;
let save_file;

let exported;

function boundingBox(table) {
  
  let x_max = -999.0;
  let x_min = 999.0;
  let y_max = -999.0;
  let y_min = 999.0;
  let z_max = -999.0;
  let z_min = 999.0;
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
    
    x_max = (x > x_max) ? x : x_max;
    x_min = (x < x_min) ? x : x_min;
    y_max = (y > y_max) ? y : y_max;
    y_min = (y < y_min) ? y : y_min;
    z_max = (z > z_max) ? z : z_max;
    z_min = (z < z_min) ? z : z_min;
  }
  return [x_min, x_max, y_min, y_max, z_min, z_max];
}

function preload() {
  positions = loadTable("https://raw.githubusercontent.com/standupmaths/xmastree2021/main/coords_2021.csv", "csv");
}

function setup() {
  createCanvas(500, 500, WEBGL);

  let fps = 60;
  frameRate(fps);
  
  light_size = 3;
  tree_scale = 100;
  
  colorMode(HSL);
  start_color = color(random(360), 100, 50);
  end_color = color((hue(start_color) + 180) % 360, saturation(start_color), lightness(start_color));
  colorMode(RGB);
 
  start_color_original = start_color;
  end_color_original = end_color;
  
  rgb = color(0, 0, 0);
  offsets = [];
  
  // these control the final pattern
  speed = 1.0 / 120.0; // 0.01;
  save_file = true;
  
  colors = new p5.Table();
  exported = false;
  
  bb = boundingBox(positions);
  
  // add headers
  colors.addColumn("FRAME_ID");
  
  for (let i = 0; i < positions.getRowCount(); i++) {
    colors.addColumn("R_" + nf(i));
    colors.addColumn("G_" + nf(i));
    colors.addColumn("B_" + nf(i));
    
    offsets[i] = 0; // random(-45.0, 45.0);
  }

  preroll = 0;
  frames = 720;
  
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
  let anim = cos(PI * speed * frameCount);
  //anim = max(0, min(anim, 1.0)); // clamp
  
  for (let i = 0; i < positions.getRowCount(); i++) {

    // note that we need to modify the axes
    x = positions.getNum(i, 0);
    y = -positions.getNum(i, 2);
    z = positions.getNum(i, 1);
 
    let a = start_color;
    let b = end_color;
    
    colorMode(HSL);
    a = color((hue(start_color) + offsets[i]) % 360.0,
                      saturation(start_color), 
                      lightness(start_color));
  
    b = color((hue(end_color) + offsets[i]) % 360.0,
                      saturation(end_color), 
                      lightness(end_color));
  
  colorMode(RGB);
    
    let yy = map(y, bb[2], bb[3], 0.0, 1.0);
    yy += anim;
    rgb = lerpColor(a, b, yy);
      
    j = i * 3;
    if (f >= preroll && f < (preroll + frames) && !exported) { 
      colors.setNum(f-preroll, j+1, int(red(rgb)));
      colors.setNum(f-preroll, j+2, int(green(rgb)));
      colors.setNum(f-preroll, j+3, int(blue(rgb)));
    }
    
    push();
      translate(x * tree_scale, y * tree_scale, z * tree_scale);
      emissiveMaterial(red(rgb), green(rgb), blue(rgb));
      sphere(light_size);
    pop();
  
  }
  
  colorMode(HSB);
  let hue_speed = speed;
  start_color = color((hue(start_color) + 1.0) % 360.0,
                      saturation(start_color), 
                      brightness(start_color));
  
  end_color = color((hue(end_color) + 1.0) % 360.0,
                      saturation(end_color), 
                      brightness(end_color)); 
  colorMode(RGB);
  
  //if(floor(hue(start_color)) == floor(hue(start_color_original)))
  //   print(frameCount);
  
  if (f == (preroll + frames) && !exported) {
      if (save_file) {
        print("exporting " + nf(frames));
        saveTable(colors, "lerp.csv", "csv");
      }
      exported = true;
    }
}