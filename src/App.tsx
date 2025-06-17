import React, { useState } from 'react';
import Cassette from './components/Cassette';
import './styles/App.scss';

function App() {
  const [currentCover, setCurrentCover] = useState<number>(1);
  const [currentBodyColor, setCurrentBodyColor] = useState<number>(1);
  const [currentLabel, setCurrentLabel] = useState<string>('This tape is for you');
  const [currentBackground, setCurrentBackground] = useState<number>(1);
  
  const totalCovers = 5;
  const totalBodyColors = 10;
  const totalBackgrounds = 15;
  
  const bodyColorNames = [
    'Blue', 'Orange', 'Dark Grey', 'Light Grey', 
    'Grass Green', 'Cheerful Yellow', 'Red', 'Purple', 'Pink', 'Cream'
  ];

  const backgroundNames = [
    'Default', 'Checkerboard', 'Diagonal Stripes', 'Pride', 'Psychedelic',
    'Wood Grain', 'Denim', 'Neon Grid', 'Notebook Paper', 'Vinyl Records',
    'Soft Lavender', 'Warm Cream', 'Isometric Cubes', 'Dot Grid', 'Graph Paper'
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

  const goToBackground = (backgroundNumber: number) => {
    setCurrentBackground(backgroundNumber);
  };

  const randomizeAll = () => {
    setCurrentCover(Math.floor(Math.random() * totalCovers) + 1);
    setCurrentBodyColor(Math.floor(Math.random() * totalBodyColors) + 1);
    setCurrentBackground(Math.floor(Math.random() * totalBackgrounds) + 1);
    setCurrentLabel(defaultLabels[Math.floor(Math.random() * defaultLabels.length)]);
  };

  const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLabel(event.target.value);
  };

  return (
    <div className={`app background-${currentBackground}`}>
      <div className="demo-container">
        <div className="cassette-wrapper">
          <Cassette 
            label={currentLabel} 
            cover={currentCover} 
            bodyColor={currentBodyColor}
            progress={25}
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
          <div className="background-indicators">
            <h3>Background</h3>
            {Array.from({ length: totalBackgrounds }, (_, i) => i + 1).map(bgNum => (
              <button
                key={bgNum}
                className={`bg-indicator ${currentBackground === bgNum ? 'active' : ''}`}
                onClick={() => goToBackground(bgNum)}
                title={backgroundNames[bgNum - 1]}
              >
                {bgNum}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 