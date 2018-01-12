import Papa from 'papaparse';
import styles from './index.scss';


const COLORS = [
  '#FFFFFF', // white
  '#E4E4E4', // light grey
  '#888888', // grey
  '#222222', // black
  '#FFA7D1', // pink
  '#E50000', // red
  '#E59500', // orange
  '#A06A42', // brown
  '#E5D900', // yellow
  '#94E044', // lime
  '#02BE01', // green
  '#00D3DD', // cyan
  '#0083C7', // blue
  '#0000EA', // dark blue
  '#CF6EE4', // magenta
  '#820080', // purple
];

let PIXELS;

window.onload = function() {
  let canvas = document.createElement('canvas');
  canvas.id = 'canvas';
  canvas.classList.add(styles.canvas);
  canvas.width = 1000;
  canvas.height = 1000;
  document.body.appendChild(canvas)

  let infoBox = document.createElement('div')
  infoBox.id = 'info-box';
  infoBox.classList.add(styles.infoBox)
  document.body.appendChild(infoBox);

  canvas.addEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousemove', handleMouseMove);

  let ctx = canvas.getContext("2d");
  readPixels()
    .then(pixels => {
      console.log(pixels[999][999]);
      PIXELS = pixels;
      for (let row = 0; row < pixels.length; ++row) {
        for (let col = 0; col < pixels[0].length; ++col) {
          if (pixels[row][col] !== null) {
            fillPixel(ctx, col, row, pixels[row][col].color)
          }
        }
      }
    })
}

function handleCanvasClick(e) {
  let canvas = e.target;
  let x = e.offsetX;
  let y = e.offsetY;
  console.log(PIXELS[y][x].user_hash)
  let ctx = canvas.getContext("2d");
  ctx.fillStyle = 'yellow';
  ctx.fillRect(x-1, y-1, 3, 3);
  fillPixel(ctx, x, y, PIXELS[y][x].color);
}

function handleMouseMove(e) {
  if (!PIXELS) {
    return;
  }
  let canvas = e.target;
  let x = e.offsetX;
  let y = e.offsetY;
  let ctx = canvas.getContext("2d");
  let infoBox = document.querySelector('#info-box');
  let {timestamp, user_hash, color} = PIXELS[y][x];
  infoBox.innerHTML = `Time: ${timestamp} <br> User: ${user_hash} <br>Color: ${color}<br> (x, y): ${x} ${y}`;
}

function readPixels() {
  return new Promise((resolve, reject) => {
    let pixels = [];
    for (let i = 0; i < 1000; ++i) {
      pixels.push(new Array(1000).fill(null))
    }
    Papa.parse('http://localhost:8080/tile_placements_unhashed.csv', {
    //   Papa.parse('http://localhost:8080/tile_test.csv', {
      download: true,
      // worker: true,
      step: function(stepData) {
        let line = stepData.data[0];
        let [timestamp, user_hash, x, y, color] = line;
        x = Number.parseInt(x);
        y = Number.parseInt(y);
        try {
          pixels[y][x] = {
            timestamp: timestamp,
            user_hash: user_hash,
            color: COLORS[Number.parseInt(color)],
            x: x,
            y: y
          };
        } catch (e) {
        }
      },
      complete: function(result) {
        console.log('finished loading data');
        resolve(pixels);
      }
    });
  })
}

function randomColor() {
  return COLORS[Math.floor(Math.random() * 16)];
}


function fillPixel(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1)
}

let i;
