import React, { useState } from 'react';
import Cassette from './components/Cassette';
import './styles/App.scss';

type PlayState = 'STOP' | 'FW' | 'BW' | 'FFW' | 'FBW';

function App() {
  const [playState, setPlayState] = useState<PlayState>('FW');
  const [currentCover, setCurrentCover] = useState<number>(1);
  const [progress, setProgress] = useState<number>(50);
  
  const totalCovers = 5;
  
  const nextCover = () => {
    setCurrentCover(prev => prev === totalCovers ? 1 : prev + 1);
  };
  
  const prevCover = () => {
    setCurrentCover(prev => prev === 1 ? totalCovers : prev - 1);
  };
  
  const goToCover = (coverNumber: number) => {
    setCurrentCover(coverNumber);
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(event.target.value));
  };

  return (
    <div className="app">
      <h1>Cassette Component Demo</h1>
      <div className="demo-container">
        <button className="carousel-btn carousel-btn-prev" onClick={prevCover}>
          ‹
        </button>
        <div className="cassette-wrapper">
          <Cassette 
            label="This tape is for you" 
            cover={currentCover} 
            playState={playState} 
            progress={progress}
          />
          <div className="cover-indicators">
            {Array.from({ length: totalCovers }, (_, i) => i + 1).map(coverNum => (
              <button
                key={coverNum}
                className={`indicator ${currentCover === coverNum ? 'active' : ''}`}
                onClick={() => goToCover(coverNum)}
              >
                {coverNum}
              </button>
            ))}
          </div>
        </div>
        <button className="carousel-btn carousel-btn-next" onClick={nextCover}>
          ›
        </button>
      </div>
      
      <div className="progress-control">
        <label htmlFor="progress-slider">Tape Progress: {progress}%</label>
        <input
          id="progress-slider"
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="progress-slider"
        />
        <div className="progress-labels">
          <span>Start</span>
          <span>End</span>
        </div>
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