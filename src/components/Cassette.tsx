import React, { Component } from 'react';
import reel from '../assets/reel.svg';
import tape1 from '../assets/tapes/1.svg';
import tape2 from '../assets/tapes/2.svg';
import tape3 from '../assets/tapes/3.svg';
import tape4 from '../assets/tapes/4.svg';
import tape5 from '../assets/tapes/5.svg';
import '../styles/cassette.scss';

type PlayState = 'STOP' | 'FW' | 'BW' | 'FFW' | 'FBW';

interface CassetteProps {
  label: string;
  cover?: number;
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

class Cassette extends Component<CassetteProps, CassetteState> {
  constructor(props: CassetteProps) {
    super(props);
    this.state = {
      play: false
    };
  }

  // Generate dynamic spools based on progress
  generateSpools = (progress: number = 50): string => {
    // Ensure progress is between 0 and 100
    const normalizedProgress = Math.max(0, Math.min(100, progress));
    
    // Calculate spool sizes based on progress
    // At 0%: Left spool is full (large), Right spool is empty (small)
    // At 100%: Left spool is empty (small), Right spool is full (large)
    const minRadius = 55; // Minimum outer radius (ensures spool always visible)
    const maxRadius = 143; // Maximum outer radius (from original SVG)
    
    const leftSpoolRadius = minRadius + (maxRadius - minRadius) * (1 - normalizedProgress / 100);
    const rightSpoolRadius = minRadius + (maxRadius - minRadius) * (normalizedProgress / 100);
    
    // Fixed center points and inner opening sizes
    const leftCenter = { x: 143, y: 143 }; // Spool A center
    const rightCenter = { x: 106, y: 106 }; // Spool B center (relative to its transform)
    const innerRadius = 36; // Fixed inner opening radius
    
    return `
      <svg width="350px" height="219px" viewBox="0 0 670 420" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- Mask for left spool with hole -->
          <mask id="leftSpoolMask">
            <circle cx="${leftCenter.x}" cy="${leftCenter.y}" r="${leftSpoolRadius + 10}" fill="white"/>
            <circle cx="${leftCenter.x}" cy="${leftCenter.y}" r="${innerRadius}" fill="black"/>
          </mask>
          <!-- Mask for right spool with hole -->
          <mask id="rightSpoolMask">
            <circle cx="${rightCenter.x}" cy="${rightCenter.y}" r="${rightSpoolRadius + 10}" fill="white"/>
            <circle cx="${rightCenter.x}" cy="${rightCenter.y}" r="${innerRadius}" fill="black"/>
          </mask>
        </defs>
        
        <g transform="translate(55.000000, 44.000000)">
          <!-- Left Spool (Spool-A) -->
          <g mask="url(#leftSpoolMask)">
            <!-- Outer ring -->
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="${leftSpoolRadius}" 
              fill="#3E3D3E" 
            />
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="${leftSpoolRadius - 5}" 
              fill="none" 
              stroke="#6C6C6C" 
              stroke-width="10" 
            />
            <!-- Inner structure (fixed) -->
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="70" 
              fill="#6C6C6C" 
            />
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="67" 
              fill="none" 
              stroke="#3E3D3E" 
              stroke-width="6" 
            />
            <circle 
              cx="${leftCenter.x}" 
              cy="${leftCenter.y}" 
              r="45" 
              fill="#B5B5B5" 
            />
          </g>
          
          <!-- Right Spool (Spool-B) -->
          <g transform="translate(312.000000, 37.000000)" mask="url(#rightSpoolMask)">
            <!-- Outer ring -->
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="${rightSpoolRadius}" 
              fill="#3E3D3E" 
            />
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="${rightSpoolRadius - 5}" 
              fill="none" 
              stroke="#6C6C6C" 
              stroke-width="10" 
            />
            <!-- Inner structure (fixed) - same as left spool -->
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="70" 
              fill="#6C6C6C" 
            />
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="67" 
              fill="none" 
              stroke="#3E3D3E" 
              stroke-width="6" 
            />
            <circle 
              cx="${rightCenter.x}" 
              cy="${rightCenter.y}" 
              r="45" 
              fill="#B5B5B5" 
            />
          </g>
        </g>
      </svg>
    `;
  };

  render() {
    const { label, cover = 1, playState = 'FW', progress = 50 } = this.props;
    const coverImage = tapeCovers[cover] || tapeCovers[1];
    const playStateClass = `tape-${playState.toLowerCase()}`;

    return (
      <div className={`tape ${playStateClass}`}>
        <img src={reel} alt="Reel A" className="tape-reelA" />
        <img src={reel} alt="Reel B" className="tape-reelB" />
        <div className="tape-spools" dangerouslySetInnerHTML={{ __html: this.generateSpools(progress) }} />
        <img src={coverImage} alt="Tape Cover" className="tape-cover" />
        <p className="tape-label">{label}</p>
      </div>
    );
  }
}

export default Cassette; 