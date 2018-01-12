import React from 'react';
import {render} from 'react-dom';

import App from "./components/App/App"

import styles from './index.scss';


let root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

render(
  <App />,
  root
);
