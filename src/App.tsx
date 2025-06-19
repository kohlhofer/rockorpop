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
  {
    label: '80s German Synth',
    url: '?cover=2&shell=9&bg=8&label=80s%20German%20Synth&playlist=PL9NOKG-8bUwqcG2Dd8GUKzwSG3di9mQ1m',
  },
];

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
  
  // If no URL parameters, load a random preset
  if (!params.toString()) {
    const randomPreset = tapePresets[Math.floor(Math.random() * tapePresets.length)];
    const presetParams = new URLSearchParams(randomPreset.url.startsWith('?') ? randomPreset.url.slice(1) : randomPreset.url);
    
    // Update URL with the random preset
    const newUrl = window.location.pathname + randomPreset.url;
    window.history.replaceState(null, '', newUrl);
    
    return {
      cover: parseInt(presetParams.get('cover') || '1'),
      bodyColor: parseInt(presetParams.get('shell') || '1'),
      background: parseInt(presetParams.get('bg') || '1'),
      label: presetParams.get('label') ? decodeURIComponent(presetParams.get('label')!) : labelOptions[Math.floor(Math.random() * labelOptions.length)],
      playlistId: presetParams.get('playlist') || '',
      videoId: presetParams.get('video') || ''
    };
  }
  
  // Otherwise, load from URL parameters as before
  return {
    cover: parseInt(params.get('cover') || '0') || Math.floor(Math.random() * 5) + 1,
    bodyColor: parseInt(params.get('shell') || '0') || Math.floor(Math.random() * 10) + 1,
    background: parseInt(params.get('bg') || '0') || Math.floor(Math.random() * 24) + 1,
    label: params.get('label') ? decodeURIComponent(params.get('label')!) : labelOptions[Math.floor(Math.random() * labelOptions.length)],
    playlistId: params.get('playlist') || '',
    videoId: params.get('video') || ''
  };
};

function App() {
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
  const playerRef = useRef<HTMLDivElement>(null);
  const { playlistId } = extractYouTubeIds(playlistUrl);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [playlistLength, setPlaylistLength] = useState<number>(0);
  const [currentVideoTitle, setCurrentVideoTitle] = useState<string>('');
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [playerResetKey, setPlayerResetKey] = useState(0);
  
  const totalCovers = 5;
  const totalBodyColors = 10;
  const totalBackgrounds = 24;
  
  const bodyColorNames = [
    'Blue', 'Orange', 'Dark Grey', 'Light Grey', 
    'Grass Green', 'Cheerful Yellow', 'Red', 'Purple', 'Pink', 'Cream'
  ];

  const backgroundNames = [
    'Default', 'Checkerboard', 'Diagonal Stripes', 'Pride', 'Psychedelic',
    'Wood Grain', 'Denim', 'Neon Grid', 'Notebook Paper', 'Vinyl Records',
    'Soft Lavender', 'Warm Cream', 'Isometric Cubes', 'Dot Grid', 'Graph Paper',
    'Rock or Pop', 'Memphis Style', 'Holographic Waves', 'Circuit Board', 'Retro TV Static',
    'Neon Zigzag', 'Retro Bubble Grid', 'Digital Rain', 'Retro Waves'
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
      const playerTarget = playerRef.current;
      if (!playerTarget) return;
      
      // Clear any existing player
      if (player) {
        player.destroy();
      }
      
      // Reset all states when switching playlists
      setCurrentProgress(0);
      setCurrentVideoTitle('');
      setCurrentTrackIndex(0);
      setYtPlayState('STOP');  // Ensure play controls show stopped state
      
      // Initialize new player
      const playerConfig = {
        height: '100%',
        width: '100%',
        playerVars: {
          listType: 'playlist',
          list: playlistId,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0
        },
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            // Get initial video title
            try {
              const videoData = event.target.getVideoData();
              if (videoData) {
                setCurrentVideoTitle(videoData.title || '');
              }
              
              // Get playlist length
              setPlaylistLength(event.target.getPlaylist()?.length || 0);
            } catch (e) {
              console.error('Error getting video data:', e);
            }
          },
          onStateChange: (event: any) => {
            try {
              const videoData = event.target.getVideoData();
              if (videoData) {
                setCurrentVideoTitle(videoData.title || '');
              }
              
              // Update playlist length
              setPlaylistLength(event.target.getPlaylist()?.length || 0);
              
              // Update current track index
              setCurrentTrackIndex(event.target.getPlaylistIndex());
            } catch (e) {
              console.error('Error getting video data:', e);
            }
          },
          onError: (event: any) => {
            console.error('YouTube player error:', event.data);
          }
        }
      };
      
      // Create new player instance
      new (window as any).YT.Player(playerTarget, playerConfig);
    };

    initializePlayer();
  }, [ytReady, playlistId, playerResetKey]);

  // Calculate and update progress
  useEffect(() => {
    if (!player) return;
    
    const updateProgress = () => {
      try {
        if (player.getCurrentTime && player.getDuration) {
          const current = player.getCurrentTime();
          const total = player.getDuration();
          if (current && total) {
            setCurrentProgress((current / total) * 100);
          }
        }
      } catch (e) {
        console.error('Error updating progress:', e);
      }
    };
    
    const intervalId = setInterval(updateProgress, 1000);
    return () => clearInterval(intervalId);
  }, [player]);

  // Handle play state changes
  useEffect(() => {
    if (!player) return;
    
    try {
      if (ytPlayState === 'STOP') {
        player.pauseVideo();
      } else if (ytPlayState === 'FW') {
        player.playVideo();
      }
    } catch (e) {
      console.error('Error controlling playback:', e);
    }
  }, [ytPlayState, player]);

  const handlePlay = () => {
    setYtPlayState('FW');
  };

  const handlePause = () => {
    setYtPlayState('STOP');
  };

  const handlePrev = () => {
    if (!player) return;
    try {
      player.previousVideo();
      const videoData = player.getVideoData();
      setCurrentVideoTitle(videoData?.title || '');
    } catch (e) {
      console.error('Error playing previous video:', e);
    }
  };

  const handleNext = () => {
    if (!player) return;
    try {
      player.nextVideo();
      const videoData = player.getVideoData();
      setCurrentVideoTitle(videoData?.title || '');
    } catch (e) {
      console.error('Error playing next video:', e);
    }
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentLabel(e.target.value);
  };

  const handlePlaylistUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaylistUrl(e.target.value);
  };

  const handleShareTape = () => {
    setShareDialogOpen(true);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    }
  };

  const handlePresetSelect = (selectedUrl: string) => {
    // Remove leading ? if present
    const cleanUrl = selectedUrl.startsWith('?') ? selectedUrl.slice(1) : selectedUrl;
    const params = new URLSearchParams(cleanUrl);
    
    // Update all relevant state
    const cover = parseInt(params.get('cover') || '1');
    const bodyColor = parseInt(params.get('shell') || '1');
    const background = parseInt(params.get('bg') || '1');
    const label = params.get('label') ? decodeURIComponent(params.get('label')!) : currentLabel;
    const playlistId = params.get('playlist') || '';
    const videoId = params.get('video') || '';
    
    setCurrentCover(cover);
    setCurrentBodyColor(bodyColor);
    setCurrentBackground(background);
    setCurrentLabel(label);
    setPlaylistUrl(reconstructYouTubeUrl(playlistId, videoId));
  };

  // Add useEffect to increment playerResetKey when playlistUrl changes
  useEffect(() => {
    setPlayerResetKey(k => k + 1);
    setCurrentProgress(0);
  }, [playlistUrl]);

  // Update document title when label or track changes
  useEffect(() => {
    const trackInfo = currentVideoTitle ? ` - ${currentVideoTitle}` : '';
    document.title = `${currentLabel}${trackInfo} | rockorpop.com`;
  }, [currentLabel, currentVideoTitle]);

  return (
    <div className={`app background-${currentBackground}`}>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-14 md:h-16 flex items-center justify-between px-3 md:px-4 z-[2000]">
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            onClick={handleShareTape}
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[13px] md:text-sm font-bold text-white bg-[#0E9DCC]/70 hover:bg-[#0E9DCC]/80 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg width="14" height="14" className="md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>
          <TapeDropdown
            options={tapePresets.map(p => ({ label: p.label, value: p.url }))}
            value={playlistUrl}
            onSelect={handlePresetSelect}
            label="Tapes..."
          />
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => setConfigPanelOpen(!configPanelOpen)}
            className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-[13px] md:text-sm font-bold text-[#2A1810] bg-[#FFB300]/80 hover:bg-[#FFB300]/90 backdrop-blur-md shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <svg width="14" height="14" className="md:w-4 md:h-4 text-[#E53935]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            Make a tape...
          </button>
        </div>
      </nav>

      <div className="min-h-screen flex flex-col">
        {/* Main Content */}
        <main className="flex-1">
          {/* Cassette Section */}
          <div className="pt-48 pb-32 flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-12">
              {/* Cassette Component */}
              <div className="w-full flex flex-col items-center gap-8">
                <Cassette 
                  label={currentLabel} 
                  cover={currentCover} 
                  bodyColor={currentBodyColor}
                  playState={ytPlayState}
                  progress={currentProgress}
                />
                
                {/* Playback Controls */}
                <div className="flex justify-center items-center bg-black/50 backdrop-blur-md rounded-full px-4 py-1 shadow-lg">
                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                        className="w-12 h-12 flex items-center justify-center text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                        className="w-12 h-12 flex items-center justify-center text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                      className="w-8 h-8 flex items-center justify-center text-white/90 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      onClick={handleNext}
                      title="Next"
                      disabled={!playlistId || !ytReady || player?.getPlaylistIndex?.() === playlistLength - 1}
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
          </div>
        </main>

        {/* Video Section as Footer - Outside main content for full width */}
        <footer className="w-screen">
          {/* Current Track Info Bar */}
          <div className="w-full h-[60px] bg-black/60 flex items-center px-4">
            <div className="flex-1 min-w-0 flex items-start justify-start text-white">
              <div className="flex-1 min-w-0 mr-4 flex flex-col justify-center">
                <div className="text-sm font-medium mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis text-left">
                  {currentVideoTitle || 'No track playing'}
                </div>
                <div className="text-xs text-white/70 text-left">
                  {playlistLength > 0 && typeof currentTrackIndex === 'number' 
                    ? `${currentTrackIndex + 1}/${playlistLength}` 
                    : ''}
                </div>
              </div>
              <div className="flex items-center text-xs text-white/70">
              </div>
            </div>
          </div>

          {/* Video Player */}
          {playlistId && (
            <div className="w-full flex justify-center bg-black pt-5 pb-10">
              <div className="w-full max-w-[356px] aspect-video">
                <div id="yt-player-bar" ref={playerRef} className="w-full h-full" />
              </div>
            </div>
          )}
        </footer>
      </div>

      {/* Side Panel Overlay */}
      {configPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[2000]" 
          onClick={() => setConfigPanelOpen(false)} 
        />
      )}

      {/* Side Panel */}
      <div 
        className={`fixed top-0 ${configPanelOpen ? 'right-0' : '-right-full'} w-full md:w-[400px] lg:w-[450px] h-full 
        bg-gradient-to-br from-[rgba(245,242,232,0.65)] to-[rgba(232,220,192,0.50)] 
        backdrop-blur-2xl backdrop-saturate-[1.2] border-l-2 border-[rgba(139,125,107,0.3)] 
        shadow-[-4px_0_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out 
        z-[2002] overflow-y-auto`}
      >
        <div className="sticky top-0 left-0 right-0 h-14 md:h-16 flex items-center justify-between px-8 bg-gradient-to-b from-[rgba(245,242,232,0.9)] to-transparent border-b border-[rgba(139,125,107,0.2)]">
          <h2 className="text-[#4a3f36] text-lg font-bold">Design Your Tape</h2>
          <button 
            className="w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center
            text-[#6b5b4f] text-xl font-bold transition-all duration-200 hover:bg-white/90 
            hover:border-2 hover:border-[rgba(139,125,107,0.4)] hover:-translate-y-0.5 
            hover:shadow-md active:translate-y-0.5 active:bg-white active:border-[rgba(139,125,107,0.6)] 
            active:shadow-sm"
            onClick={() => setConfigPanelOpen(false)}
            title="Close Settings"
          >
            ✕
          </button>
        </div>

        <div className="p-6 pt-4 md:p-8 md:pt-6">
          {/* Cassette Label Section */}
          <div className="mb-8">
            <label 
              htmlFor="cassette-label" 
              className="block mb-2 text-[#4a3f36] text-base font-semibold"
            >
              Name Your Tape
            </label>
            <input
              id="cassette-label"
              type="text"
              value={currentLabel}
              onChange={handleLabelChange}
              placeholder="Enter a catchy title..."
              className="w-full px-4 py-3 text-[15px] border-2 border-[rgba(139,125,107,0.3)] 
              rounded-lg bg-white/90 text-[#4a3f36] transition-all duration-200
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.5)]
              focus:outline-none focus:border-[#6b5b4f] focus:bg-white/95 
              focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_0_0_3px_rgba(107,91,79,0.1)]
              placeholder:text-[#4a3f36]/50"
            />
          </div>

          {/* YouTube Playlist Section */}
          <div className="mb-8">
            <label 
              htmlFor="playlist-url"
              className="block mb-2 text-[#4a3f36] text-base font-semibold"
            >
              Add Your Music
            </label>
            <p className="mb-3 text-sm text-[#6b5b4f]/80">Paste a YouTube playlist URL to load your favorite tracks. The playlist will be converted into a retro cassette experience.</p>
            <input
              id="playlist-url"
              type="url"
              value={playlistUrl}
              onChange={handlePlaylistUrlChange}
              placeholder="Paste YouTube playlist URL..."
              className="w-full px-4 py-3 text-[15px] border-2 border-[rgba(139,125,107,0.3)] 
              rounded-lg bg-white/90 text-[#4a3f36] transition-all duration-200
              shadow-[inset_0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.5)]
              focus:outline-none focus:border-[#6b5b4f] focus:bg-white/95 
              focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_0_0_3px_rgba(107,91,79,0.1)]
              placeholder:text-[#4a3f36]/50"
            />
          </div>

          {/* Style Options */}
          <div className="space-y-8">
            {/* Cover Art Section */}
            <div>
              <label className="block mb-3 text-sm text-[#6b5b4f]/80">
                Choose Cover Design
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalCovers }, (_, i) => i + 1).map(coverNum => (
                  <button
                    key={coverNum}
                    onClick={() => goToCover(coverNum)}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 
                    ${currentCover === coverNum 
                      ? 'bg-gradient-to-br from-[#6b5b4f] to-[#4a3f36] text-[#f5f2e8] border-[#4a3f36] scale-110 shadow-md' 
                      : 'bg-gradient-to-br from-[#f5f2e8] to-[#e8dcc0] text-[#6b5b4f] border-[rgba(139,125,107,0.3)] hover:scale-105'
                    }
                    text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center
                    shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]`}
                  >
                    {coverNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Shell Color Section */}
            <div>
              <label className="block mb-3 text-sm text-[#6b5b4f]/80">
                Pick Shell Color
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalBodyColors }, (_, i) => i + 1).map(colorNum => (
                  <button
                    key={colorNum}
                    onClick={() => goToBodyColor(colorNum)}
                    title={bodyColorNames[colorNum - 1]}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 
                    ${currentBodyColor === colorNum 
                      ? 'bg-gradient-to-br from-[#6b5b4f] to-[#4a3f36] text-[#f5f2e8] border-[#4a3f36] scale-110 shadow-md' 
                      : 'bg-gradient-to-br from-[#f5f2e8] to-[#e8dcc0] text-[#6b5b4f] border-[rgba(139,125,107,0.3)] hover:scale-105'
                    }
                    text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center
                    shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]`}
                  >
                    {colorNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Section */}
            <div>
            <label className="block mb-3 text-sm text-[#6b5b4f]/80">
                Set Background Style
              </label>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalBackgrounds }, (_, i) => i + 1).map(bgNum => (
                  <button
                    key={bgNum}
                    onClick={() => goToBackground(bgNum)}
                    title={backgroundNames[bgNum - 1]}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full border-2 
                    ${currentBackground === bgNum 
                      ? 'bg-gradient-to-br from-[#6b5b4f] to-[#4a3f36] text-[#f5f2e8] border-[#4a3f36] scale-110 shadow-md' 
                      : 'bg-gradient-to-br from-[#f5f2e8] to-[#e8dcc0] text-[#6b5b4f] border-[rgba(139,125,107,0.3)] hover:scale-105'
                    }
                    text-xs md:text-sm font-bold transition-all duration-200 flex items-center justify-center
                    shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.3)]`}
                  >
                    {bgNum}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Randomize Button */}
          <div className="mt-8 pt-6 border-t border-[rgba(139,125,107,0.2)]">
            <button
              onClick={randomizeAll}
              className="w-full px-6 py-3.5 text-sm font-semibold text-white 
              bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-lg
              shadow-[0_3px_6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
              transition-all duration-200 hover:from-[#45a049] hover:to-[#3d8b40]
              hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]
              active:translate-y-0.5 active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]
              text-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]"
            >
              Surprise Me with Random Design
            </button>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      {shareDialogOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-[2001]" 
            onClick={() => setShareDialogOpen(false)} 
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-[2002] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Share your tape</h3>
              <button 
                onClick={() => setShareDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                title="Close"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">Save this URL to get back to your current tape or share it with others.</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={window.location.href}
                  readOnly
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"
                />
                <button 
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    copySuccess 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
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