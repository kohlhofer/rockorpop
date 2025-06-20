# Rock or Pop? 🎵

A beautiful web app for creating and sharing virtual mixtapes with a retro cassette interface. Turn your YouTube playlists into virtual cassette tapes with a nostalgic, interactive UI.

## 🌟 Features

- **YouTube Playlist Integration**: Turn any YouTube playlist into a virtual cassette tape
- **Interactive Cassette UI**: Beautiful, animated cassette interface with realistic tape movement
- **Customization Options**:
  - 5 different cassette cover designs
  - 10 shell colors to choose from
  - 24 background styles
  - Custom tape labels
- **Playback Controls**: Play, pause, previous, and next track controls
- **Progress Tracking**: Visual tape spool movement reflecting playlist progress
- **Share Your Tapes**: Generate shareable links to your customized mixtapes
- **Social Media Preview**: Rich social media previews when sharing your mixtapes, showing your exact cassette design

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kohlhofer/rockorpop.git
cd rockorpop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

### Generating Social Preview Images

The app includes a script to generate Open Graph preview images for all possible cassette combinations:

```bash
npm run generate-previews
```

This will create preview images in the `public/og-image` directory for:
- All cassette cover designs (5)
- All shell colors (10)
- All background styles (24)
- All possible combinations

Note: The preview generation script requires Node.js and uses browser APIs, so it needs to be run in a browser-like environment.

## 🛠️ Built With

- React 18
- TypeScript
- Vite
- TailwindCSS
- SASS
- YouTube IFrame Player API
- React Helmet Async (for social media meta tags)

## 🎨 Design

The app features a skeuomorphic design that brings the nostalgic feel of cassette tapes to the digital age. The interface includes:

- Animated tape spools that reflect actual playback progress
- Realistic cassette shell designs
- Custom cover art options
- Interactive playback controls
- Customizable tape labels
- Social media preview images showing exact cassette designs

## 📝 License

ISC License

## 🌐 Live Demo

Visit [rockorpop.com](https://rockorpop.com) to try it out! 

## 🔄 Recent Updates

- **Enhanced Social Sharing**: Added rich social media previews with Open Graph meta tags
- **Improved YouTube Integration**: Fixed player cleanup and initialization for smoother playlist switching
- **Better State Management**: Improved handling of player state during navigation and customization
- **Performance Optimizations**: Optimized DOM management for YouTube player integration 