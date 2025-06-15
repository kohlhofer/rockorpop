import React, { Component } from 'react';
import reel from '../assets/reel.svg';
import spools from '../assets/spools.svg';
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

  getCover(id?: number): string {
    if (id && tapeCovers[id]) {
      return tapeCovers[id];
    } else {
      const random = Math.floor(Math.random() * 5) + 1;
      return tapeCovers[random];
    }
  }

  getPlayStateClass(): string {
    const state = this.props.playState || 'FW';
    return `tape-${state.toLowerCase()}`;
  }

  render() {
    return (
      <div className={`tape ${this.getPlayStateClass()}`}>
        <img src={reel} className="tape-reelA" alt="tape reel" />
        <img src={reel} className="tape-reelB" alt="tape reel" />
        <img src={spools} className="tape-spools" alt="tape spools" />
        <img src={this.getCover(this.props.cover)} className="tape-cover" alt="tape" />
        <h1 className="tape-label">{this.props.label}</h1>
      </div>
    );
  }
}

export default Cassette; 