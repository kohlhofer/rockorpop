import React, { useState } from 'react';
import Cassette from './components/Cassette';
import './styles/App.scss';

type PlayState = 'STOP' | 'FW' | 'BW' | 'FFW' | 'FBW';

function App() {
  const [playState, setPlayState] = useState<PlayState>('FW');

  return (
    <div className="app">
      <h1>Cassette Component Demo</h1>
      <div className="demo-container">
        <Cassette label="This tape is for you" cover={2} playState={playState} />
      </div>
      <div className="controls">
        <button onClick={() => setPlayState('STOP')}>Stop</button>
        <button onClick={() => setPlayState('FW')}>Play</button>
        <button onClick={() => setPlayState('BW')}>Reverse</button>
        <button onClick={() => setPlayState('FFW')}>Fast Forward</button>
        <button onClick={() => setPlayState('FBW')}>Fast Reverse</button>
      </div>
    </div>
  );
}

export default App; 