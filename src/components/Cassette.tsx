import React, { Component } from 'react';
import reel from '../assets/reel.svg';
import tape1 from '../assets/tapes/1.svg';
import tape2 from '../assets/tapes/2.svg';
import tape3 from '../assets/tapes/3.svg';
import tape4 from '../assets/tapes/4.svg';
import tape5 from '../assets/tapes/5.svg';
import '../styles/cassette.scss';

type PlayState = 'STOP' | 'FW' | 'BW' | 'FFW' | 'FBW';

interface BodyColor {
  body: string;
  outline: string;
}

interface CassetteProps {
  label?: string;
  cover?: number;
  bodyColor?: number;
  playState?: PlayState;
  progress?: number; // 0-100, represents tape progress
}

interface CassetteState {
  play: boolean;
}

const tapeCovers: Record<number, string> = {
  1: tape1,
  2: tape2,
  3: tape3,
  4: tape4,
  5: tape5
};

// Define available body color combinations
const bodyColors: Record<number, BodyColor> = {
  1: { body: '#0E9DCC', outline: '#0080AA' }, // Blue
  2: { body: '#FF6C24', outline: '#DF4900' }, // Orange
  3: { body: '#686868', outline: '#4B4B4B' }, // Dark Grey
  4: { body: '#A7A7A7', outline: '#838383' }, // Light Grey
  5: { body: '#4CAF50', outline: '#388E3C' }, // Grass Green
  6: { body: '#FFD54F', outline: '#FFB300' }, // Cheerful Yellow
  7: { body: '#F44336', outline: '#D32F2F' }, // Red
  8: { body: '#7B1FA2', outline: '#4A148C' }, // Purple
  9: { body: '#F48FB1', outline: '#F06292' }, // Pink
  10: { body: '#F5F0E8', outline: '#D0C5B8' }, // Cream
};

// Default labels to choose from when none is provided
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

class Cassette extends Component<CassetteProps, CassetteState> {
  private randomCover: number;
  private randomBodyColor: number;
  private randomLabel: string;

  constructor(props: CassetteProps) {
    super(props);
    this.state = {
      play: false
    };
    
    // Generate random defaults that will be consistent for this instance
    this.randomCover = Math.floor(Math.random() * 5) + 1; // 1-5
    this.randomBodyColor = Math.floor(Math.random() * 10) + 1; // 1-10
    this.randomLabel = defaultLabels[Math.floor(Math.random() * defaultLabels.length)];
  }

  // Load and modify SVG with custom body colors
  loadAndModifySVG = async (svgPath: string, bodyColor: BodyColor): Promise<string> => {
    try {
      const response = await fetch(svgPath);
      let svgText = await response.text();
      
      // Replace the body and outline colors in the SVG
      // Find and replace the fill colors for elements with id="Body" or similar
      svgText = svgText.replace(
        /(<path[^>]*id="Body[^"]*"[^>]*fill=")[^"]*(")/g,
        `$1${bodyColor.body}$2`
      );
      
      // Find and replace the fill colors for elements with id="Outline" or similar
      svgText = svgText.replace(
        /(<path[^>]*id="Outline[^"]*"[^>]*fill=")[^"]*(")/g,
        `$1${bodyColor.outline}$2`
      );
      
      return svgText;
    } catch (error) {
      console.error('Error loading SVG:', error);
      return '';
    }
  };

  // Generate dynamic spools based on progress
  generateSpools = (progress: number = 50): string => {
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.max(0, Math.min(100, progress));
    
    // Calculate spool sizes based on progress
    // At 0%: Left spool is full (large), Right spool is empty (small)
    // At 100%: Left spool is empty (small), Right spool is full (large)
    const minTapeRadius = 65; // Minimum tape radius (ensures spool always visible)
    const maxTapeRadius = 145; // Maximum tape radius (from original SVG)
    
    const leftTapeRadius = minTapeRadius + (maxTapeRadius - minTapeRadius) * (1 - normalizedProgress / 100);
    const rightTapeRadius = minTapeRadius + (maxTapeRadius - minTapeRadius) * (normalizedProgress / 100);
    
    // Fixed center points and inner opening sizes
    const leftCenter = { x: 143, y: 143 }; // Spool A center
    const rightCenter = { x: 106, y: 106 }; // Spool B center (relative to its transform)
    const innerRadius = 50; // Fixed inner opening radius
    const rimRadius = 65; // Fixed light grey rim radius (small and constant)
    
    return `
      <svg width="350px" height="219px" viewBox="0 0 670 420" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Mask for left spool with hole -->
          <mask id="leftSpoolMask">
            <circle cx="${leftCenter.x}" cy="${leftCenter.y}" r="${leftTapeRadius + 10}" fill="white"/>
            <circle cx="${leftCenter.x}" cy="${leftCenter.y}" r="${innerRadius}" fill="black"/>
          </mask>
          <!-- Mask for right spool with hole -->
          <mask id="rightSpoolMask">
            <circle cx="${rightCenter.x}" cy="${rightCenter.y}" r="${rightTapeRadius + 10}" fill="white"/>
            <circle cx="${rightCenter.x}" cy="${rightCenter.y}" r="${innerRadius}" fill="black"/>
          </mask>
        </defs>
        
        <g transform="translate(55.000000, 44.000000)">
          <!-- Left Spool (Spool-A) -->
          <g mask="url(#leftSpoolMask)">
            <!-- Variable tape area (dark grey) - this scales with progress -->
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="${leftTapeRadius}" 
              fill="#3E3D3E" 
            />
            <!-- Outer edge of tape -->
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="${leftTapeRadius - 2}" 
              fill="none" 
              stroke="#6C6C6C" 
              stroke-width="2" 
            />
            <!-- Fixed light grey rim (small and constant) -->
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="${rimRadius}" 
              fill="#B5B5B5" 
            />
            <!-- Inner edge of rim -->
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="${rimRadius}" 
              fill="none" 
              stroke="#3E3D3E" 
              stroke-width="4" 
            />
          </g>
          
          <!-- Right Spool (Spool-B) -->
          <g transform="translate(312.000000, 37.000000)" mask="url(#rightSpoolMask)">
            <!-- Variable tape area (dark grey) - this scales with progress -->
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="${rightTapeRadius}" 
              fill="#3E3D3E" 
            />
            <!-- Outer edge of tape -->
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="${rightTapeRadius}" 
              fill="none" 
              stroke="#6C6C6C" 
              stroke-width="2" 
            />
            <!-- Fixed light grey rim (small and constant) -->
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="${rimRadius}" 
              fill="#B5B5B5" 
            />
            <!-- Inner edge of rim -->
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="${rimRadius}" 
              fill="none" 
              stroke="#3E3D3E" 
              stroke-width="4" 
            />
          </g>
        </g>
      </svg>
    `;
  };

  render() {
    const { 
      label = this.randomLabel, 
      cover = this.randomCover, 
      bodyColor = this.randomBodyColor, 
      playState = 'FW', 
      progress = 25 
    } = this.props;
    
    const coverImage = tapeCovers[cover] || tapeCovers[1];
    const selectedBodyColor = bodyColors[bodyColor] || bodyColors[1];
    const playStateClass = `tape-${playState.toLowerCase()}`;

    return (
      <div className={`tape ${playStateClass}`}>
        <img src={reel} alt="Reel A" className="tape-reelA" />
        <img src={reel} alt="Reel B" className="tape-reelB" />
        <div className="tape-spools" dangerouslySetInnerHTML={{ __html: this.generateSpools(progress) }} />
        <CoverWithBodyColor 
          coverImage={coverImage} 
          bodyColor={selectedBodyColor} 
        />
        <p className="tape-label">{label}</p>
      </div>
    );
  }
}

// Component to handle SVG modification and rendering
interface CoverWithBodyColorProps {
  coverImage: string;
  bodyColor: BodyColor;
}

interface CoverWithBodyColorState {
  modifiedSVG: string;
}

class CoverWithBodyColor extends Component<CoverWithBodyColorProps, CoverWithBodyColorState> {
  constructor(props: CoverWithBodyColorProps) {
    super(props);
    this.state = {
      modifiedSVG: ''
    };
  }

  async componentDidMount() {
    await this.loadModifiedSVG();
  }

  async componentDidUpdate(prevProps: CoverWithBodyColorProps) {
    if (prevProps.coverImage !== this.props.coverImage || 
        prevProps.bodyColor !== this.props.bodyColor) {
      await this.loadModifiedSVG();
    }
  }

  loadModifiedSVG = async () => {
    try {
      const response = await fetch(this.props.coverImage);
      let svgText = await response.text();
      
      // Replace the body and outline colors in the SVG
      svgText = svgText.replace(
        /(<path[^>]*id="Body[^"]*"[^>]*fill=")[^"]*(")/g,
        `$1${this.props.bodyColor.body}$2`
      );
      
      svgText = svgText.replace(
        /(<path[^>]*id="Outline[^"]*"[^>]*fill=")[^"]*(")/g,
        `$1${this.props.bodyColor.outline}$2`
      );
      
      this.setState({ modifiedSVG: svgText });
    } catch (error) {
      console.error('Error loading SVG:', error);
    }
  };

  render() {
    return (
      <div 
        className="tape-cover" 
        dangerouslySetInnerHTML={{ __html: this.state.modifiedSVG }} 
      />
    );
  }
}

export default Cassette; 