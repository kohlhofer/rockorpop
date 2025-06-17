# Cassette Component

A highly customizable React TypeScript component that displays an animated cassette tape with realistic tape progress visualization, multiple cover designs, shell colors, and playback states.

## ✨ Features

- **🎨 10 Shell Colors**: Blue, Orange, Dark Grey, Light Grey, Grass Green, Cheerful Yellow, Red, Purple, Pink, Cream
- **🎭 5 Cover Designs**: Unique label designs and graphics for each cover
- **⚡ 5 Playback States**: Stop, Play (Forward), Reverse, Fast Forward, Fast Reverse
- **📼 Realistic Tape Progress**: Dynamic spool visualization showing tape position (0-100%)
- **🎬 Smooth Animations**: Spinning reels with different speeds based on playback state

## 🚀 Installation

```bash
npm install
```

## 🛠️ Development

To start the development server:

```bash
npm run dev
```

The interactive demo will be available at http://localhost:5173

## 📖 Usage

### Basic Usage

```tsx
import Cassette from './components/Cassette';

// Simplest usage - completely random cassette!
<Cassette />

// With just a custom label
<Cassette label="My Awesome Mixtape" />
```

### Advanced Usage

```tsx
import Cassette from './components/Cassette';

// Fully customized cassette
<Cassette 
  label="Summer Vibes 2024"
  cover={3}              // Cover design (1-5)
  bodyColor={6}          // Shell color (1-10) - Cheerful Yellow
  playState="FW"         // Playback state
  progress={75}          // Tape progress (0-100%)
/>
```

### Interactive Example

```tsx
import React, { useState } from 'react';
import Cassette from './components/Cassette';

function MyPlayer() {
  const [progress, setProgress] = useState(25);
  const [playState, setPlayState] = useState('STOP');

  return (
    <div>
      <Cassette 
        label="Interactive Demo"
        cover={1}
        bodyColor={5}
        playState={playState}
        progress={progress}
      />
      
      <button onClick={() => setPlayState('FW')}>Play</button>
      <button onClick={() => setPlayState('STOP')}>Stop</button>
      
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={progress}
        onChange={(e) => setProgress(Number(e.target.value))}
      />
    </div>
  );
}
```

## 📋 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | *Random* | Text displayed on the cassette label. If not provided, randomly selects from 10 preset labels |
| `cover` | `number` | *Random* | Cover design (1-5). If not provided, randomly selects a cover |
| `bodyColor` | `number` | *Random* | Shell color (1-10). If not provided, randomly selects a color |
| `playState` | `PlayState` | `'FW'` | Playback state: `'STOP'` \| `'FW'` \| `'BW'` \| `'FFW'` \| `'FBW'` |
| `progress` | `number` | `25` | Tape progress percentage (0-100) |

### 🎲 Random Defaults

When no props are specified, the component will:
- **Label**: Randomly select from: "Mix Tape", "Summer Vibes", "Road Trip", "Chill Out", "Dance Party", "Study Session", "Workout Mix", "Late Night", "Good Times", "Memories"
- **Cover**: Randomly select from covers 1-5
- **Body Color**: Randomly select from colors 1-10
- **Play State**: Default to forward play (`'FW'`)
- **Progress**: Default to 25% (showing a tape that's just getting started)

## 🎨 Cover Designs

| Cover | Description |
|-------|-------------|
| 1 | Classic orange label with rock hand icon |
| 2 | Blue technical design with grid lines |
| 3 | Minimalist design |
| 4 | Retro style |
| 5 | Modern aesthetic |

## 🌈 Shell Colors

| Color | Name | Body Color | Outline Color |
|-------|------|------------|---------------|
| 1 | Blue | `#0E9DCC` | `#0080AA` |
| 2 | Orange | `#FF6C24` | `#DF4900` |
| 3 | Dark Grey | `#686868` | `#4B4B4B` |
| 4 | Light Grey | `#A7A7A7` | `#838383` |
| 5 | Grass Green | `#4CAF50` | `#388E3C` |
| 6 | Cheerful Yellow | `#FFD54F` | `#FFB300` |
| 7 | Red | `#C62828` | `#8E0000` |
| 8 | Purple | `#7B1FA2` | `#4A148C` |
| 9 | Pink | `#E91E63` | `#C2185B` |
| 10 | Cream | `#F5F0E8` | `#D0C5B8` |

## ⚡ Playback States

| State | Description | Reel Animation |
|-------|-------------|----------------|
| `'STOP'` | No playback | No animation |
| `'FW'` | Forward play | Normal speed clockwise |
| `'BW'` | Reverse play | Normal speed counter-clockwise |
| `'FFW'` | Fast forward | Double speed clockwise |
| `'FBW'` | Fast reverse | Double speed counter-clockwise |

## 📼 Tape Progress Visualization

The `progress` prop (0-100) creates a realistic tape visualization:

- **0%**: Left spool full, right spool empty (tape at beginning)
- **50%**: Both spools medium size (tape in middle)
- **100%**: Left spool empty, right spool full (tape at end)

The spools dynamically resize to show the tape distribution, just like a real cassette!

## 🎯 Combinations

With 5 cover designs and 10 shell colors, you can create **50 unique combinations**:

```tsx
// Grass green shell with technical blue cover
<Cassette label="Nature Sounds" cover={2} bodyColor={5} />

// Pink shell with classic orange cover  
<Cassette label="80s Hits" cover={1} bodyColor={9} />

// Cream shell with minimalist cover
<Cassette label="Jazz Collection" cover={3} bodyColor={10} />
```

## 🏗️ Building

To build the component:

```bash
npm run build
```

## 👀 Preview Production Build

To preview the production build:

```bash
npm run preview
```

## 🎨 Styling

The component uses SCSS modules and includes a vintage-themed background. The cassette maintains a fixed aspect ratio and scales responsively.

### CSS Classes

- `.tape` - Main container
- `.tape-cover` - SVG cover container
- `.tape-spools` - Dynamic spool visualization
- `.tape-reelA`, `.tape-reelB` - Spinning reel elements
- `.tape-label` - Label text overlay

## 🔧 Technical Details

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS with CSS modules
- **Graphics**: SVG-based with dynamic color manipulation
- **Animations**: CSS keyframes for smooth reel rotation
- **State Management**: Component-level state with props

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

---

Made with ❤️ for music lovers and retro enthusiasts 