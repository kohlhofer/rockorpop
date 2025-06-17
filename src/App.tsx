import React, { useState } from 'react';
import Cassette from './components/Cassette';
import './styles/App.scss';

function App() {
  const labelOptions = [
    'This tape is for you',
    'Summer Vibes \'24',
    'Road Trip Mix',
    'Late Night Sessions',
    'Workout Beats',
    'Chill & Study',
    'Party Anthems',
    'Acoustic Sessions',
    'Throwback Hits',
    'Coffee Shop Jazz',
    'Rainy Day Blues',
    'Feel Good Mix',
    'Dance Floor Fire',
    'Midnight Drive',
    'Sunday Morning'
  ];

  const [currentCover, setCurrentCover] = useState<number>(
    Math.floor(Math.random() * 5) + 1
  );
  const [currentBodyColor, setCurrentBodyColor] = useState<number>(
    Math.floor(Math.random() * 10) + 1
  );
  const [currentLabel, setCurrentLabel] = useState<string>(
    labelOptions[Math.floor(Math.random() * labelOptions.length)]
  );
  const [currentBackground, setCurrentBackground] = useState<number>(
    Math.floor(Math.random() * 15) + 1
  );
  const [configPanelOpen, setConfigPanelOpen] = useState<boolean>(false);
  
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
    // Label is excluded from randomization - user can edit it manually
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
          
          <button 
            className="edit-btn" 
            onClick={() => setConfigPanelOpen(!configPanelOpen)}
            title="Edit Settings"
          >
            ✏️
          </button>
        </div>
      </div>

      {/* Side Panel Overlay */}
      {configPanelOpen && (
        <div className="panel-overlay" onClick={() => setConfigPanelOpen(false)} />
      )}

      {/* Side Panel */}
      <div className={`side-panel ${configPanelOpen ? 'open' : ''}`}>
        <div className="panel-header">
          <h2>Edit tape</h2>
          <button 
            className="close-btn" 
            onClick={() => setConfigPanelOpen(false)}
            title="Close Settings"
          >
            ✕
          </button>
        </div>

        <div className="panel-content">
          <div className="content-section">
            <h3>Cassette Label</h3>
            <input
              type="text"
              value={currentLabel}
              onChange={handleLabelChange}
              placeholder="Enter cassette label..."
              className="label-text-input"
            />
          </div>

          <div className="style-section">
            <div className="style-options">
              <div className="option-group">
                <label>Cover Art</label>
                <div className="selector-grid">
                  {Array.from({ length: totalCovers }, (_, i) => i + 1).map(coverNum => (
                    <button
                      key={coverNum}
                      className={`selector-btn ${currentCover === coverNum ? 'active' : ''}`}
                      onClick={() => goToCover(coverNum)}
                    >
                      {coverNum}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Shell Color</label>
                <div className="selector-grid">
                  {Array.from({ length: totalBodyColors }, (_, i) => i + 1).map(colorNum => (
                    <button
                      key={colorNum}
                      className={`selector-btn ${currentBodyColor === colorNum ? 'active' : ''}`}
                      onClick={() => goToBodyColor(colorNum)}
                      title={bodyColorNames[colorNum - 1]}
                    >
                      {colorNum}
                    </button>
                  ))}
                </div>
              </div>

              <div className="option-group">
                <label>Background</label>
                <div className="selector-grid">
                  {Array.from({ length: totalBackgrounds }, (_, i) => i + 1).map(bgNum => (
                    <button
                      key={bgNum}
                      className={`selector-btn ${currentBackground === bgNum ? 'active' : ''}`}
                      onClick={() => goToBackground(bgNum)}
                      title={backgroundNames[bgNum - 1]}
                    >
                      {bgNum}
                    </button>
                  ))}
                </div>
              </div>

              <div className="shuffle-section">
                <button className="shuffle-btn" onClick={randomizeAll}>
                  🎲 Shuffle
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 