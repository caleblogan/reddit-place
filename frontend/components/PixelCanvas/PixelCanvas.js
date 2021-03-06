import React, {Component} from 'react';

import styles from './PixelCanvas.scss';


class PixelCanvas extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.ctx = null;
    let i;
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
    if (this.props.imageData) {
      this.drawPixels();
    }
  }

  fillPixel(x, y, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, 1, 1)
  }

  drawPixels() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.putImageData(this.getImageData(), this.props.xOffset, this.props.yOffset);
  }

  getImageData() {
    return this.props.imageData;
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
    x = Math.floor(x / scale - this.props.xOffset);
    y = Math.floor(y / scale - this.props.yOffset);
    x = this.clampX(x);
    y = this.clampY(y);
    if (this.props.imageData) {
      this.props.onMouseMove(x, y);
    }
  }

  render() {
    let dynamicStyles = {
      'transform': `scale(${this.props.scale})`
    };
    return (
      <canvas
        id='canvas'
        className={styles.Canvas}
        style={dynamicStyles}
        width={this.width}
        height={this.height}
        ref={this.setRef.bind(this)}
        onMouseMove={this.handleMouseMove}
        onClick={this.props.onClick}
      >
      </canvas>
    );
  }
}

PixelCanvas.propTypes = {};

export default PixelCanvas;
