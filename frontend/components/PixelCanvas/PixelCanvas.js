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
    }
    this.canvas = null;
    this.ctx = null;
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

  drawPixels() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.save();
    this.ctx.translate(this.props.xOffset, this.props.yOffset);
    let scale = this.props.scale;
    this.ctx.scale(scale, scale);

    // TODO: Update drawing. Its very slow
    let pixels = this.props.data;
    for (let row = 0; row < pixels.length; ++row) {
      for (let col = 0; col < pixels[0].length; ++col) {
        if (pixels[row][col] !== null) {
          this.fillPixel(col, row, pixels[row][col].color)
        }
      }
    }
    this.ctx.restore();
  }

  setRef(canvas) {
    if (canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }
  }

  getCoordsFromEvent(e) {
    let {x: offsetX, y: offsetY} = e.target.getBoundingClientRect();
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    return {x, y}
  }

  get width() {
    return this.props.width || 1200;
  }

  get height() {
    return this.props.height || 1200;
  }

  render() {
    return (
      <canvas
        id='canvas' className={styles.canvas}
        width={this.width} height={this.height}
        ref={this.setRef.bind(this)}
      >
      </canvas>
    );
  }
}

PixelCanvas.propTypes = {};

export default PixelCanvas;
