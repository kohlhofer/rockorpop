# Cassette Component

A React TypeScript component that displays an animated cassette tape with customizable label and cover.

## Features

- Animated cassette tape with spinning reels
- Customizable label text
- 5 different tape cover designs
- Responsive design
- TypeScript support

## Installation

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The demo will be available at http://localhost:3000

## Usage

```tsx
import Cassette from './components/Cassette';

// With a specific cover (1-5)
<Cassette label="This tape is for you" cover={2} />

// With a random cover
<Cassette label="Random tape" />
```

## Props

| Prop   | Type     | Required | Description                                    |
|--------|----------|----------|------------------------------------------------|
| label  | string   | Yes      | The text to display on the cassette label      |
| cover  | number   | No       | The cover design to use (1-5). If not provided, a random cover will be selected |

## Building

To build the component:

```bash
npm run build
```

## Preview Production Build

To preview the production build:

```bash
npm run preview
``` 