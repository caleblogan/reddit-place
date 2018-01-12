import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './PixelCanvas.scss';

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

class PixelCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomLevel: 0,
      dragging: false,
    }
    this.canvas = null;
    this.ctx = null;
    this.minZoom = 0;
    this.maxZoom = 10;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidUpdate() {
    if (this.props.data) {
      this.drawPixels();
    }
    console.log('updated:', this.props);
  }

  fillPixel(x, y, color) {
    this.ctx.fillStyle = COLORS[color];
    this.ctx.fillRect(x, y, 1, 1)
  }

  // Use nearest neighbour zoom
  zoom() {
    if (this.state.zoomLevel <= this.minZoom || this.state.zoomLevel >= this.maxZoom) {
      return;
    }
    this.setState(prevState => ({zoomLevel: prevState.zoomLevel + 1}))

  }

  pan() {

  }

  drawPixels() {
    let pixels = this.props.data;
    for (let row = 0; row < pixels.length; ++row) {
      for (let col = 0; col < pixels[0].length; ++col) {
        if (pixels[row][col] !== null) {
          this.fillPixel(col, row, pixels[row][col].color)
        }
      }
    }
  }

  setRef(canvas) {
    if (canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }
  }
  
  handleMouseDown(e) {
    console.log('mouse down');
  }
  
  handleMouseUp(e) {
    console.log('mouse up')
  }

  render() {
    return (
      <canvas
        id='canvas' className={styles.canvas}
        width={1000} height={1000}
        ref={this.setRef.bind(this)}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
      >
      </canvas>
    );
  }
}

PixelCanvas.propTypes = {};

export default PixelCanvas;
