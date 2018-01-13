import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './PixelCanvas.scss';


class PixelCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.canvas = null;
    this.ctx = null;

    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      !this.props.data ||
      this.props.scale != nextProps.scale ||
      this.props.xOffset != nextProps.xOffset ||
      this.props.yOffset != nextProps.yOffset
    );
  }

  componentDidUpdate() {
    if (this.props.data) {
      this.drawPixels();
    }

    console.log('updated:', this.props);
  }

  fillPixel(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1)
  }

  drawPixels(data) {
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

  clampX(x) {
    if (x < 0) {
      return 0
    }
    if (x > this.width - 1) {
      return this.width - 1
    }
    return x
  }

  clampY(y) {
    if (y < 0) {
      return 0;
    }
    if (y > this.height - 1) {
      return this.height - 1;
    }
    return y;
  }

  get width() {
    return this.props.width || 1200;
  }

  get height() {
    return this.props.height || 1200;
  }

  handleMouseMove(e) {
    let {x, y} = this.getCoordsFromEvent(e);
    let scale = this.props.scale;
    x = Math.floor(x / scale - this.props.xOffset / scale);
    y = Math.floor(y / scale - this.props.yOffset / scale);
    x = this.clampX(x);
    y = this.clampY(y);
    if (this.props.data) {
      this.props.onMouseMove(this.props.data[y][x]);
    }
  }

  render() {
    return (
      <canvas
        id='canvas' className={styles.canvas}
        width={this.width} height={this.height}
        ref={this.setRef.bind(this)}
        onMouseMove={this.handleMouseMove}
      >
      </canvas>
    );
  }
}

PixelCanvas.propTypes = {};

export default PixelCanvas;
