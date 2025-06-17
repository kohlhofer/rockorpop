import React, { useState, useEffect } from 'react';
import Cassette from './components/Cassette';
import './styles/App.scss';

// Utility function to extract YouTube playlist ID and video ID from URL
const extractYouTubeIds = (url: string): { playlistId: string; videoId: string } => {
  if (!url) return { playlistId: '', videoId: '' };
  
  try {
    const urlObj = new URL(url);
    
    // Handle different YouTube URL formats
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      const playlistId = urlObj.searchParams.get('list') || '';
      let videoId = '';
      
      // Standard playlist URL: https://www.youtube.com/playlist?list=PLxxxxxx
      if (urlObj.pathname === '/playlist') {
        return { playlistId, videoId: '' };
      }
      
      // Video URL with playlist: https://www.youtube.com/watch?v=xxxxx&list=PLxxxxxx
      if (urlObj.pathname === '/watch') {
        videoId = urlObj.searchParams.get('v') || '';
        return { playlistId, videoId };
      }
      
      // Short URL with playlist: https://youtu.be/xxxxx?list=PLxxxxxx
      if (urlObj.hostname === 'youtu.be') {
        videoId = urlObj.pathname.slice(1); // Remove leading slash
        return { playlistId, videoId };
      }
    }
  } catch (error) {
    console.warn('Invalid URL provided:', url);
  }
  
  return { playlistId: '', videoId: '' };
};

// Utility function to reconstruct YouTube URL from IDs
const reconstructYouTubeUrl = (playlistId: string, videoId: string): string => {
  if (!playlistId) return '';
  
  if (videoId) {
    // Return full URL with both video and playlist
    return `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`;
  } else {
    // Return playlist-only URL
    return `https://www.youtube.com/playlist?list=${playlistId}`;
  }
};

// Utility function to update URL parameters
const updateUrlParams = (cover: number, bodyColor: number, background: number, label: string, playlistId: string, videoId: string) => {
  const params = new URLSearchParams();
  
  if (cover !== 1) params.set('cover', cover.toString());
  if (bodyColor !== 1) params.set('shell', bodyColor.toString());
  if (background !== 1) params.set('bg', background.toString());
  if (label) params.set('label', encodeURIComponent(label));
  if (playlistId) params.set('playlist', playlistId);
  if (videoId) params.set('video', videoId);
  
  const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
  window.history.replaceState(null, '', newUrl);
};

// Utility function to load settings from URL parameters
const loadFromUrlParams = () => {
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

  const params = new URLSearchParams(window.location.search);
  
  return {
    cover: parseInt(params.get('cover') || '0') || Math.floor(Math.random() * 5) + 1,
    bodyColor: parseInt(params.get('shell') || '0') || Math.floor(Math.random() * 10) + 1,
    background: parseInt(params.get('bg') || '0') || Math.floor(Math.random() * 15) + 1,
    label: params.get('label') ? decodeURIComponent(params.get('label')!) : labelOptions[Math.floor(Math.random() * labelOptions.length)],
    playlistId: params.get('playlist') || '',
    videoId: params.get('video') || ''
  };
};

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

  // Load initial settings from URL or use random defaults
  const initialSettings = loadFromUrlParams();

  const [currentCover, setCurrentCover] = useState<number>(initialSettings.cover);
  const [currentBodyColor, setCurrentBodyColor] = useState<number>(initialSettings.bodyColor);
  const [currentLabel, setCurrentLabel] = useState<string>(initialSettings.label);
  const [currentBackground, setCurrentBackground] = useState<number>(initialSettings.background);
  const [playlistUrl, setPlaylistUrl] = useState<string>(
    reconstructYouTubeUrl(initialSettings.playlistId, initialSettings.videoId)
  );
  const [configPanelOpen, setConfigPanelOpen] = useState<boolean>(false);
  const [shareDialogOpen, setShareDialogOpen] = useState<boolean>(false);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  
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

  // Sync state changes to URL parameters
  useEffect(() => {
    const { playlistId, videoId } = extractYouTubeIds(playlistUrl);
    updateUrlParams(currentCover, currentBodyColor, currentBackground, currentLabel, playlistId, videoId);
  }, [currentCover, currentBodyColor, currentBackground, currentLabel, playlistUrl]);

  // Event handlers
  const handleCoverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentCover(parseInt(e.target.value));
  };

  const handleBodyColorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentBodyColor(parseInt(e.target.value));
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLabel(e.target.value);
  };

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentBackground(parseInt(e.target.value));
  };

  const handlePlaylistUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistUrl(e.target.value);
  };

  // Share tape functionality
  const handleShareTape = () => {
    setShareDialogOpen(true);
    setCopySuccess(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = window.location.href;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // New tape functionality
  const handleNewTape = () => {
    // Clear URL parameters
    window.history.replaceState(null, '', window.location.pathname);
    
    // Generate new random values
    const newCover = Math.floor(Math.random() * totalCovers) + 1;
    const newBodyColor = Math.floor(Math.random() * totalBodyColors) + 1;
    const newBackground = Math.floor(Math.random() * totalBackgrounds) + 1;
    const newLabel = labelOptions[Math.floor(Math.random() * labelOptions.length)];
    
    // Update state
    setCurrentCover(newCover);
    setCurrentBodyColor(newBodyColor);
    setCurrentBackground(newBackground);
    setCurrentLabel(newLabel);
    setPlaylistUrl('');
    
    // Open the config panel
    setConfigPanelOpen(true);
  };

  return (
    <div className={`app background-${currentBackground}`}>
      {/* Top Left Action Button */}
      <div className="top-left-actions">
        <button className="action-btn share-btn" onClick={handleShareTape}>
          Save and share
        </button>
      </div>

      {/* Top Right Action Buttons */}
      <div className="top-right-actions">
        <button 
          className="action-btn edit-btn" 
          onClick={() => setConfigPanelOpen(!configPanelOpen)}
          title="Edit tape"
        >
          Edit
        </button>
        <button className="action-btn new-btn" onClick={handleNewTape}>
          New
        </button>
      </div>

      <div className="demo-container">
        <div className="cassette-wrapper">
          <Cassette 
            label={currentLabel} 
            cover={currentCover} 
            bodyColor={currentBodyColor}
            progress={25}
          />
        </div>
      </div>

      {/* Side Panel Overlay */}
      {configPanelOpen && (
        <div className="panel-overlay" onClick={() => setConfigPanelOpen(false)} />
      )}

      {/* Side Panel */}
      <div className={`side-panel ${configPanelOpen ? 'open' : ''}`}>
        <button 
          className="close-btn" 
          onClick={() => setConfigPanelOpen(false)}
          title="Close Settings"
        >
          ✕
        </button>

        <div className="panel-content">
          <div className="content-section">
            <label htmlFor="cassette-label">Cassette Label</label>
            <input
              id="cassette-label"
              type="text"
              value={currentLabel}
              onChange={handleLabelChange}
              placeholder="Enter cassette label..."
              className="label-text-input"
            />
          </div>

          <div className="content-section">
            <label htmlFor="playlist-url">YouTube Playlist</label>
            <input
              id="playlist-url"
              type="url"
              value={playlistUrl}
              onChange={handlePlaylistUrlChange}
              placeholder="Paste YouTube playlist URL..."
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
        
        <div className="bookmark-note">
          <p>💡 <strong>Tip:</strong> Use "Save and share" to get a URL that preserves your tape. Bookmark it or share it with friends!</p>
        </div>
      </div>

      {/* Share Dialog */}
      {shareDialogOpen && (
        <>
          <div className="dialog-overlay" onClick={() => setShareDialogOpen(false)} />
          <div className="share-dialog">
            <div className="dialog-header">
              <h3>Share your tape</h3>
              <button 
                className="close-btn" 
                onClick={() => setShareDialogOpen(false)}
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="dialog-content">
              <p>Save this URL to get back to your current tape or share it with others.</p>
              <div className="url-container">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="url-input"
                />
                <button 
                  className={`copy-btn ${copySuccess ? 'success' : ''}`}
                  onClick={handleCopyUrl}
                  title="Copy to clipboard"
                >
                  {copySuccess ? '✓ Copied!' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App; 