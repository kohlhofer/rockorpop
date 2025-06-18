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
    background: parseInt(params.get('bg') || '0') || Math.floor(Math.random() * 16) + 1,
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
  const totalBackgrounds = 16;
  
  const bodyColorNames = [
    'Blue', 'Orange', 'Dark Grey', 'Light Grey', 
    'Grass Green', 'Cheerful Yellow', 'Red', 'Purple', 'Pink', 'Cream'
  ];

  const backgroundNames = [
    'Default', 'Checkerboard', 'Diagonal Stripes', 'Pride', 'Psychedelic',
    'Wood Grain', 'Denim', 'Neon Grid', 'Notebook Paper', 'Vinyl Records',
    'Soft Lavender', 'Warm Cream', 'Isometric Cubes', 'Dot Grid', 'Graph Paper',
    'Rock or Pop'
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
      const newPlayer = new (window as any).YT.Player(playerTarget, {
        height: '200',
        width: '356',
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
      const timeout: NodeJS.Timeout = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timeout);
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
      const timeout: NodeJS.Timeout = setTimeout(() => setCopySuccess(false), 2000);
      return () => clearTimeout(timeout);
    }
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
    {
      label: '80s German Synth',
      url: '?cover=2&shell=9&bg=8&label=80s%20German%20Synth&playlist=PL9NOKG-8bUwqcG2Dd8GUKzwSG3di9mQ1m',
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
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-16 md:h-[64px] bg-[rgba(20,20,20,0.85)] backdrop-blur-lg backdrop-saturate-[1.2] flex items-center justify-between px-4 md:px-5 z-[2000] shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShareTape}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-[#2ecc71] to-[#27ae60] hover:from-[#27ae60] hover:to-[#219a52] transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>
          <TapeDropdown
            options={tapePresets.map(p => ({ label: p.label, value: p.url }))}
            value={selectedPreset}
            onSelect={handlePresetSelect}
            label="Tapes..."
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setConfigPanelOpen(!configPanelOpen)}
            className="px-4 py-2 text-sm font-semibold text-white/80 hover:text-white transition-colors duration-200"
          >
            Make a tape...
          </button>
        </div>
      </nav>

      <div className="demo-container">
        <div className="cassette-wrapper">
          <Cassette 
            label={currentLabel} 
            cover={currentCover} 
            bodyColor={currentBodyColor}
            playState={ytPlayState}
            progress={currentProgress}
          />
          {/* YouTube Player (visible, fixed at bottom right) */}
          <div className="youtube-container">
            <div id="yt-player-bar" ref={playerRef} />
          </div>
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
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[2000]" 
          onClick={() => setConfigPanelOpen(false)} 
        />
      )}

      {/* Side Panel */}
      <div 
        className={`fixed top-0 ${configPanelOpen ? 'right-0' : '-right-full'} w-full md:w-[400px] lg:w-[450px] h-full 
        bg-gradient-to-br from-[rgba(245,242,232,0.60)] to-[rgba(232,220,192,0.45)] 
        backdrop-blur-2xl backdrop-saturate-[1.2] border-l-2 border-[rgba(139,125,107,0.3)] 
        shadow-[-4px_0_20px_rgba(0,0,0,0.15)] transition-all duration-300 ease-in-out 
        z-[2002] overflow-y-auto flex flex-col`}
      >
        <button 
          className="absolute top-5 right-5 w-8 h-8 md:w-9 md:h-9 rounded flex items-center justify-center
          text-[#6b5b4f] text-xl font-bold transition-all duration-200 hover:bg-white/90 
          hover:border-2 hover:border-[rgba(139,125,107,0.4)] hover:-translate-y-0.5 
          hover:shadow-md active:translate-y-0.5 active:bg-white active:border-[rgba(139,125,107,0.6)] 
          active:shadow-sm z-10"
          onClick={() => setConfigPanelOpen(false)}
          title="Close Settings"
        >
          ✕
        </button>

        <div className="p-12 pt-16 md:p-8 md:pt-12">
          {/* Cassette Label Section */}
          <div className="mb-8">
            <label 
              htmlFor="cassette-label" 
              className="block mb-3 text-[#4a3f36] text-base font-semibold 
              text-shadow-[1px_1px_2px_rgba(255,255,255,0.5)] cursor-pointer"
            >
              Cassette Label
            </label>
            <input
              id="cassette-label"
              type="text"
              value={currentLabel}
              onChange={handleLabelChange}
              placeholder="Enter cassette label..."
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
              className="block mb-3 text-[#4a3f36] text-base font-semibold 
              text-shadow-[1px_1px_2px_rgba(255,255,255,0.5)] cursor-pointer"
            >
              YouTube Playlist
            </label>
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
          <div className="space-y-6">
            {/* Cover Art Section */}
            <div>
              <label className="block mb-3 text-[#4a3f36] text-base font-semibold 
                text-shadow-[1px_1px_2px_rgba(255,255,255,0.5)]">
                Cover Art
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
              <label className="block mb-3 text-[#4a3f36] text-base font-semibold 
                text-shadow-[1px_1px_2px_rgba(255,255,255,0.5)]">
                Shell Color
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
              <label className="block mb-3 text-[#4a3f36] text-base font-semibold 
                text-shadow-[1px_1px_2px_rgba(255,255,255,0.5)]">
                Background
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
              className="w-full px-6 py-3 text-sm font-semibold text-white 
              bg-gradient-to-br from-[#4CAF50] to-[#45a049] rounded-lg
              shadow-[0_3px_6px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)]
              transition-all duration-200 hover:from-[#45a049] hover:to-[#3d8b40]
              hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]
              active:translate-y-0.5 active:shadow-[0_2px_4px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]
              text-shadow-[1px_1px_2px_rgba(0,0,0,0.2)]"
            >
              Randomize Design
            </button>
          </div>
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
        {/* Optionally, show a static thumbnail or icon here for compliance */}
        <div className="yt-bottom-bar-thumb" onClick={handleYouTubeClick}>
          <div className="yt-thumb-video">
            {/* You could render a static image or YouTube logo here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 