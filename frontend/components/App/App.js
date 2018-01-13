import 'bootstrap/dist/css/bootstrap.css';
import React, {Component} from 'react';
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
    };
    this.updateSelectedPixel = this.updateSelectedPixel.bind(this);
  }

  componentDidMount() {
    this.loadPlacements()
      .then(res => {
        this.setState({placements: res, selectedPixel: res[2][400]});
      })
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
      Papa.parse('http://localhost:8080/tile_placements_unhashed.csv', {
      // Papa.parse('http://localhost:8080/tile_test.csv', {
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

  /**
   * Gets the pixel data in a multidimensional array ready for the canvas
   * @returns {*}
   */
  getPixelData() {
    return this.state.placements;
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
        <Camera width={'100%'} height={'100%'}>
          <PixelCanvas onMouseMove={this.updateSelectedPixel} data={this.getPixelData()}/>
        </Camera>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
