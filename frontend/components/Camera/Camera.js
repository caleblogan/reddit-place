import React, {Component} from 'react';
import PropTypes from 'prop-types';

import styles from './Camera.scss';

class Camera extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zoomLevel: 1,
      xOffset: 0,
      yOffset: 0,
    }
    this.panning = false;
    this.maxZoom = 10;
    this.minZoom = 1;
    this.handleClick = this.handleClick.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
  }

  handleMouseDown(e) {
    let i;
    this.panning = true;
    this.panningOrigin = {
      x: e.clientX,
      y: e.clientY,
      startOffsetX: this.state.xOffset,
      startOffsetY: this.state.yOffset
    };
  }

  handleMouseUp(e) {
    this.panning = false;
  }

  handleMouseMove(e) {
    let i;
    if (this.panning) {
      let x = e.clientX - this.panningOrigin.x + this.panningOrigin.startOffsetX;
      let y = e.clientY - this.panningOrigin.y + this.panningOrigin.startOffsetY;
      this.setState({xOffset: x, yOffset: y});
    }
  }

  handleWheel(e) {
    if (e.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
    e.preventDefault();
  }

  zoomIn() {
    if (this.state.zoomLevel >= this.maxZoom) {
      return;
    }
    this.setState(prevState => ({zoomLevel: prevState.zoomLevel + 1}));
  }

  zoomOut() {
    if (this.state.zoomLevel <= this.minZoom) {
      return;
    }
    this.setState(prevState => ({zoomLevel: prevState.zoomLevel - 1}));
  }

  render() {
    let i;
    return (
      <div
        className={styles.camera}
        style={{width: this.props.width, height: this.props.height}}
        onClick={this.handleClick}
        onContextMenu={this.handleClick}
        onWheel={this.handleWheel}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      >
        {React.cloneElement(this.props.children, {xOffset: this.state.xOffset, yOffset: this.state.yOffset, scale: this.state.zoomLevel})}
      </div>
    );
  }
}

Camera.propTypes = {};

export default Camera;
