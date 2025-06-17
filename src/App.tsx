import React, { useState } from 'react';
import Cassette from './components/Cassette';
import './styles/App.scss';

type PlayState = 'STOP' | 'FW' | 'BW' | 'FFW' | 'FBW';

function App() {
  const [playState, setPlayState] = useState<PlayState>('FW');
  const [currentCover, setCurrentCover] = useState<number>(1);
  const [currentBodyColor, setCurrentBodyColor] = useState<number>(1);
  const [currentLabel, setCurrentLabel] = useState<string>('This tape is for you');
  const [progress, setProgress] = useState<number>(25);
  
  const totalCovers = 5;
  const totalBodyColors = 10;
  
  const bodyColorNames = [
    'Blue', 'Orange', 'Dark Grey', 'Light Grey', 
    'Grass Green', 'Cheerful Yellow', 'Red', 'Purple', 'Pink', 'Cream'
  ];

  const defaultLabels = [
    "Mix Tape",
    "Summer Vibes", 
    "Road Trip",
    "Chill Out",
    "Dance Party",
    "Study Session",
    "Workout Mix",
    "Late Night",
    "Good Times",
    "Memories"
  ];
  
  const goToCover = (coverNumber: number) => {
    setCurrentCover(coverNumber);
  };

  const goToBodyColor = (colorNumber: number) => {
    setCurrentBodyColor(colorNumber);
  };

  const randomizeAll = () => {
    setCurrentCover(Math.floor(Math.random() * totalCovers) + 1);
    setCurrentBodyColor(Math.floor(Math.random() * totalBodyColors) + 1);
    setCurrentLabel(defaultLabels[Math.floor(Math.random() * defaultLabels.length)]);
    setProgress(Math.floor(Math.random() * 101)); // 0-100
    // Keep current play state - don't randomize that
  };

  const handleProgressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgress(Number(event.target.value));
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLabel(event.target.value);
  };

  return (
    <div className="app">
      <h1>Cassette Component Demo</h1>
      <div className="demo-container">
        <div className="cassette-wrapper">
          <Cassette 
            label={currentLabel} 
            cover={currentCover} 
            bodyColor={currentBodyColor}
            playState={playState} 
            progress={progress}
          />
          
          <div className="randomize-section">
            <button className="randomize-btn" onClick={randomizeAll}>
              🎲 Randomize All
            </button>
          </div>

          <div className="label-input">
            <h3>Label Text</h3>
            <input
              type="text"
              value={currentLabel}
              onChange={handleLabelChange}
              placeholder="Enter cassette label..."
              className="label-text-input"
            />
          </div>

          <div className="cover-indicators">
            <h3>Cover Design</h3>
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
          <div className="body-color-indicators">
            <h3>Shell Color</h3>
            {Array.from({ length: totalBodyColors }, (_, i) => i + 1).map(colorNum => (
              <button
                key={colorNum}
                className={`color-indicator ${currentBodyColor === colorNum ? 'active' : ''}`}
                onClick={() => goToBodyColor(colorNum)}
                title={bodyColorNames[colorNum - 1]}
              >
                {colorNum}
              </button>
            ))}
          </div>
        </div>
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