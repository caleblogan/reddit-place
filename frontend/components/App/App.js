import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Papa from 'papaparse';

import styles from './App.scss';
import PixelCanvas from "../PixelCanvas/PixelCanvas"
import Camera from "../Camera/Camera"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placements: null,
    };
  }

  componentDidMount() {
    this.loadPlacements()
      .then(res => {
        this.setState({placements: res})
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
              timestamp: timestamp,
              user_hash: user_hash,
              color: Number.parseInt(color),
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

  render() {
    return (
      <div>
        <div className={styles.pixelInfo}>
          Info
        </div>
        <Camera width={'100%'} height={'100%'}>
          <PixelCanvas onMouseMove={this.handleMouseMove} data={this.getPixelData()}/>
        </Camera>
      </div>
    );
  }
}

App.propTypes = {};

export default App;
