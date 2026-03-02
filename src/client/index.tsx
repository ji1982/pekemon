import React from 'react';
import ReactDOM from 'react-dom/client';
import GameWrapper from './GameWrapper';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GameWrapper />
  </React.StrictMode>
);