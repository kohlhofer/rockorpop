import React, { useState, useEffect, useRef } from 'react';
import Cassette from './components/Cassette';
import TapeDropdown from './components/TapeDropdown';
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
  const [player, setPlayer] = useState<any>(null);
  const [ytReady, setYtReady] = useState(false);
  const [ytPlayState, setYtPlayState] = useState<'STOP' | 'FW'>('STOP');
  const [currentIndex, setCurrentIndex] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const { playlistId, videoId } = extractYouTubeIds(playlistUrl);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [playlistLength, setPlaylistLength] = useState<number>(0);
  const [playlistDurations, setPlaylistDurations] = useState<number[]>([]);
  const progressInterval = useRef<number | null>(null);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [playerResetKey, setPlayerResetKey] = useState(0);
  
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

  // Load YouTube IFrame API
  useEffect(() => {
    if ((window as any).YT && (window as any).YT.Player) {
      setYtReady(true);
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
    (window as any).onYouTubeIframeAPIReady = () => setYtReady(true);
  }, []);

  // Create or update player when ready or playlist changes
  useEffect(() => {
    if (!ytReady || !playlistId) return;
    
    const initializePlayer = () => {
      const playerTarget = document.getElementById('yt-player-bar') || document.getElementById('yt-player');
      const newPlayer = new (window as any).YT.Player(playerTarget, {
        height: '0',
        width: '0',
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
        },
        events: {
          onReady: (event: any) => {
            const player = event.target;
            setPlayer(player);
            setYtPlayState('STOP');
            
            // Get initial playlist info
            const playlist = player.getPlaylist();
            if (playlist) {
              setPlaylistLength(playlist.length);
              
              // Get current track info
              const currentIndex = player.getPlaylistIndex();
              setCurrentTrackIndex(currentIndex);
              
              // Get video data
              const videoData = player.getVideoData();
              if (videoData) {
                setCurrentVideoTitle(videoData.title || '');
                setCurrentVideoId(videoData.video_id || '');
              }
              
              // Initialize durations array
              const durations: number[] = new Array(playlist.length).fill(0);
              setPlaylistDurations(durations);
              
              // Reset to first video and pause
              player.playVideoAt(0);
              player.pauseVideo();
            }
          },
          onStateChange: (event: any) => {
            const PlayerState = (window as any).YT.PlayerState;
            if (event.data === PlayerState.PLAYING) {
              setYtPlayState('FW');
              startProgressTracking();
            } else {
              setYtPlayState('STOP');
              stopProgressTracking();
            }
            
            // Update video info on state change
            const player = event.target;
            const videoData = player.getVideoData();
            if (videoData) {
              setCurrentVideoTitle(videoData.title || '');
              setCurrentVideoId(videoData.video_id || '');
              setCurrentTrackIndex(player.getPlaylistIndex());
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
          }
        },
      });
    };

    // Always destroy and recreate the player on playerResetKey change
    initializePlayer();
    return () => {
      if (player) {
        try {
          player.destroy();
        } catch (e) {
          console.error('Error destroying player:', e);
        }
      }
    };
  }, [ytReady, playlistId, playerResetKey]);

  // Calculate total playlist duration
  const getTotalPlaylistDuration = () => {
    return playlistDurations.reduce((total, duration) => total + duration, 0);
  };

  // Calculate progress based on current position in playlist
  const calculatePlaylistProgress = () => {
    if (!player || playlistDurations.length === 0) return 0;
    
    const currentIndex = player.getPlaylistIndex();
    const currentTime = player.getCurrentTime();
    
    // Sum up durations of completed videos
    let completedDuration = 0;
    for (let i = 0; i < currentIndex; i++) {
      completedDuration += playlistDurations[i];
    }
    
    // Add current video's progress
    const totalProgress = completedDuration + currentTime;
    const totalDuration = getTotalPlaylistDuration();
    
    // Normalize to 0-100 range
    return Math.min(100, Math.max(0, (totalProgress / totalDuration) * 100));
  };

  // Start tracking progress
  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    progressInterval.current = setInterval(() => {
      if (player) {
        const progress = calculatePlaylistProgress();
        setCurrentProgress(progress);
      }
    }, 100);
  };

  // Stop tracking progress
  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  // Playback controls
  const handlePlay = () => {
    if (player) {
      player.playVideo();
      startProgressTracking();
    }
  };
  
  const handlePause = () => {
    if (player) {
      player.pauseVideo();
      stopProgressTracking();
    }
  };
  
  const handlePrev = () => {
    if (!player) return;
    try {
      const currentIndex = player.getPlaylistIndex();
      if (currentIndex > 0) {
        player.previousVideo();
        setCurrentTrackIndex(currentIndex - 1);
        // Update video info immediately
        const videoData = player.getVideoData();
        setCurrentVideoTitle(videoData?.title || '');
        setCurrentVideoId(videoData?.video_id || '');
      }
    } catch (e) {
      console.log('Error handling prev:', e);
    }
  };
  
  const handleNext = () => {
    if (!player) return;
    try {
      const currentIndex = player.getPlaylistIndex();
      const playlistLength = player.getPlaylist()?.length || 0;
      if (currentIndex < playlistLength - 1) {
        player.nextVideo();
        setCurrentTrackIndex(currentIndex + 1);
        // Update video info immediately
        const videoData = player.getVideoData();
        setCurrentVideoTitle(videoData?.title || '');
        setCurrentVideoId(videoData?.video_id || '');
      }
    } catch (e) {
      console.log('Error handling next:', e);
    }
  };

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

  const handleYouTubeClick = () => {
    if (!player) return;
    try {
      const videoData = player.getVideoData();
      const videoId = videoData?.video_id;
      if (videoId) {
        const url = `https://www.youtube.com/watch?v=${videoId}&list=${playlistId}`;
        window.open(url, '_blank');
      }
    } catch (e) {
      console.log('Error opening YouTube:', e);
    }
  };

  // Tape presets for dropdown
  const tapePresets = [
    {
      label: 'POP Top50 - USA',
      url: '?cover=5&shell=2&bg=15&label=POP%20Top%2050%20-%20USA&playlist=PL4fGSI1pDJn77aK7sAW2AT0oOzo5inWY8',
    },
    {
      label: 'Campfire Classics',
      url: '?shell=10&bg=6&label=Campfire%20Classics&playlist=RDCLAK5uy_liwwwIG8z4P25AWeLZ2Nvydx1GwbvndEI',
    },
    {
      label: 'Back to School',
      url: '?cover=2&bg=9&label=Back%20to%20School&playlist=RDCLAK5uy_leoTLrB1K_2VcTWqds82dBcjBSjrRfJxw',
    },
    {
      label: 'BOC',
      url: '?cover=4&bg=13&label=BOC&playlist=PL221B13914A7EF3A2',
    },
    // Add more presets here as needed
  ];

  // TapeDropdown state: no preset selected by default
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const handlePresetSelect = (selectedUrl: string) => {
    if (!selectedUrl) return;
    // Parse params from selectedUrl and update state
    const params = new URLSearchParams(selectedUrl.startsWith('?') ? selectedUrl.slice(1) : selectedUrl);
    const cover = parseInt(params.get('cover') || '1');
    const shell = parseInt(params.get('shell') || '1');
    const bg = parseInt(params.get('bg') || '1');
    const label = params.get('label') ? decodeURIComponent(params.get('label')!) : '';
    const playlist = params.get('playlist') || '';
    const video = params.get('video') || '';
    setCurrentCover(cover);
    setCurrentBodyColor(shell);
    setCurrentBackground(bg);
    setCurrentLabel(label);
    setPlaylistUrl(reconstructYouTubeUrl(playlist, video));
    updateUrlParams(cover, shell, bg, label, playlist, video);
    setSelectedPreset(''); // Reset dropdown to label
  };

  // Add useEffect to increment playerResetKey when playlistUrl changes
  useEffect(() => {
    setPlayerResetKey(k => k + 1);
  }, [playlistUrl]);

  return (
    <div className={`app background-${currentBackground}`}>
      {/* Top Left Action Button */}
      <div className="top-left-actions">
        <button className="action-btn share-btn" onClick={handleShareTape}>
          Save and share
        </button>
        <TapeDropdown
          options={tapePresets.map(p => ({ label: p.label, value: p.url }))}
          value={selectedPreset}
          onSelect={handlePresetSelect}
          label="Tapes..."
        />
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
            playState={ytPlayState}
            progress={currentProgress}
          />
          {/* YouTube Player (hidden) */}
          <div id="yt-player" ref={playerRef} style={{ width: 0, height: 0, overflow: 'hidden' }} key={playerResetKey} />
          {/* Playback Controls */}
          <div className="yt-controls-container">
            <div className="yt-controls">
              <button
                className="yt-skip-btn"
                onClick={handlePrev}
                title="Previous"
                disabled={!playlistId || !ytReady || player?.getPlaylistIndex?.() === 0}
                aria-label="Previous"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="5" width="3" height="14" rx="1.5" fill="currentColor"/>
                  <polygon points="20,5 8,12 20,19" fill="currentColor"/>
                </svg>
              </button>
              {ytPlayState === 'FW' ? (
                <button
                  className="yt-play-btn"
                  onClick={handlePause}
                  title="Pause"
                  disabled={!playlistId || !ytReady}
                  aria-label="Pause"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="8" y="7" width="5" height="18" rx="2" fill="currentColor"/>
                    <rect x="19" y="7" width="5" height="18" rx="2" fill="currentColor"/>
                  </svg>
                </button>
              ) : (
                <button
                  className="yt-play-btn"
                  onClick={handlePlay}
                  title="Play"
                  disabled={!playlistId || !ytReady}
                  aria-label="Play"
                >
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="10,7 26,16 10,25" fill="currentColor"/>
                  </svg>
                </button>
              )}
              <button
                className="yt-skip-btn"
                onClick={handleNext}
                title="Next"
                disabled={!playlistId || !ytReady || player?.getPlaylistIndex?.() === playlistDurations.length - 1}
                aria-label="Next"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="18" y="5" width="3" height="14" rx="1.5" fill="currentColor"/>
                  <polygon points="4,5 16,12 4,19" fill="currentColor"/>
                </svg>
              </button>
            </div>
          </div>
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
                  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5.5C3 5.22386 3.22386 5 3.5 5H6.5C6.77614 5 7 5.22386 7 5.5C7 5.77614 6.77614 6 6.5 6H4.70711L15.1464 16.4393C15.3417 16.6346 15.3417 16.9512 15.1464 17.1464C14.9512 17.3417 14.6346 17.3417 14.4393 17.1464L4 6.70711V8.5C4 8.77614 3.77614 9 3.5 9C3.22386 9 3 8.77614 3 8.5V5.5ZM16.5 3C16.7761 3 17 3.22386 17 3.5V8.5C17 8.77614 16.7761 9 16.5 9C16.2239 9 16 8.77614 16 8.5V5.70711L5.56066 16.1464C5.3654 16.3417 5.04882 16.3417 4.85355 16.1464C4.65829 15.9512 4.65829 15.6346 4.85355 15.4393L15.2929 5H13.5C13.2239 5 13 4.77614 13 4.5C13 4.22386 13.2239 4 13.5 4H16.5Z" fill="currentColor"/>
                  </svg>
                  Shuffle design
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

      {/* Bottom Bar for YouTube compliance */}
      <div className="yt-bottom-bar">
        <div className="yt-bottom-bar-content">
          <div className="yt-track-info">
            <div className="yt-track-title">{currentVideoTitle || 'No track playing'}</div>
            <div className="yt-track-number">
              {playlistLength > 0 && typeof currentTrackIndex === 'number' 
                ? `${currentTrackIndex + 1}/${playlistLength}` 
                : ''}
            </div>
          </div>
        </div>
        <div className="yt-bottom-bar-thumb" onClick={handleYouTubeClick}>
          <div className="yt-thumb-video">
            <div id="yt-player-bar" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 