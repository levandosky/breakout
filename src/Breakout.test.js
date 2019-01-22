import React from 'react';
import ReactDOM from 'react-dom';
import Breakout from './Breakout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Breakout />, div);
  ReactDOM.unmountComponentAtNode(div);
});
