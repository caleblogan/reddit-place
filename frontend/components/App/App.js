import 'bootstrap/dist/css/bootstrap.css';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Papa from 'papaparse';

import styles from './App.scss';
import PixelCanvas from "../PixelCanvas/PixelCanvas"
import Camera from "../Camera/Camera"


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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placements: null,
      selectedPixel: {},
      pixelData: null
    };
    this.updateSelectedPixel = this.updateSelectedPixel.bind(this);
  }

  componentDidMount() {
    this.loadPlacements()
      .then(res => {
        let pixelData = this.getPixelData(res);
        console.log(pixelData);
        this.setState({
          placements: res,
          selectedPixel: res[2][400],
          pixelData
        });
      })
  }

  /**
   * Gets Pixel data in the format of ImageData which is a Uint8ClampedArray in RGBA format
   * @param placements
   */
  getPixelData(placements) {
    let height = placements.length;
    let width = placements[0].length;
    let imgDataArray = new Uint8ClampedArray(width * height * 4);
    for (let row = 0; row < height; ++row) {
      for (let col = 0; col < width; ++col) {
        let {r, g, b} = placements[row][col] ? this.rgbFromHexStr(placements[row][col].color) : {r: 0, g: 0, b: 0};
        let offset = row * (width * 4) + col * 4;
        imgDataArray[offset] = r;
        imgDataArray[offset+1] = g;
        imgDataArray[offset+2] = b;
        imgDataArray[offset+3] = 255;  // Alpha
      }
    }
    return new ImageData(imgDataArray, width, height)
  }

  rgbFromHexStr(hexStr) {
    if (!hexStr) {
      return {r: 0, g: 0, b: 0};
    }
    let r = Number.parseInt(hexStr.substr(1, 2), 16);
    let g = Number.parseInt(hexStr.substr(3, 2), 16);
    let b = Number.parseInt(hexStr.substr(5, 2), 16);
    return {r, g, b}
  }

  /**
   * Loads the placement data which include x, y, user, timestamp and color
   * @returns {Promise}
   */
  loadPlacements() {
    return new Promise((resolve, reject) => {
      let pixels = [];
      for (let i = 0; i < 1000; ++i) {
        pixels.push(new Array(1000).fill(null))
      }
      // Papa.parse('http://localhost:8080/tile_placements_unhashed.csv', {
      Papa.parse('http://localhost:8080/tile_test.csv', {
        download: true,
        step: function(stepData) {
          let line = stepData.data[0];
          let [timestamp, user_hash, x, y, color] = line;
          x = Number.parseInt(x);
          y = Number.parseInt(y);
          try {
            pixels[y][x] = {
              timestamp: Number.parseInt(timestamp),
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

  updateSelectedPixel(selectedPixel) {
    if (selectedPixel) {
      this.setState({selectedPixel})
    }
  }

  render() {
    let pixel = this.state.selectedPixel;
    let i;
    return (
      <div>
        <div className={styles.pixelInfo + ' bg-dark'}>
          <h3 className=''>Selected: </h3>
          <p>{pixel.timestamp ? new Date(pixel.timestamp).toLocaleString() : 'Invalid Date'}</p>
          <a href={'https://www.reddit.com/user/'+pixel.user_hash}><p>{pixel.user_hash}</p></a>
          <div className={styles.pixelColor} style={{backgroundColor: pixel.color}}/>
        </div>
        <Camera ref={camera => this.camera = camera} width={'100%'} height={'1000px'}>
          <PixelCanvas onMouseMove={this.updateSelectedPixel} imageData={this.state.pixelData}/>
        </Camera>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
