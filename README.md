# Swift Color Visualizer

A modern web application that helps iOS/macOS developers visualize Swift Color syntax with real-time parsing and visual feedback.

## Features

- **Swift Color Parsing**: Parse `Color(red: X, green: Y, blue: Z)` syntax with real-time validation
- **Visual Color Preview**: Large color swatch with automatic text contrast for accessibility  
- **Bidirectional Sync**: Change Swift code to update color picker, or use color picker to generate Swift code
- **Color Format Conversion**: Get RGB, HEX, and Swift formats with one-click copying
- **Modern Dark UI**: Glassmorphism design with responsive 2-column layout
- **Real-time Validation**: Instant error feedback with helpful messages

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. **Swift Code Input**: Type or paste Swift Color syntax like `Color(red: 0.2, green: 0.6, blue: 1.0)`
2. **Visual Selection**: Use the color picker to visually select colors
3. **Copy Values**: Click any color value (RGB, HEX, Swift) to copy to clipboard
4. **Real-time Preview**: See your color instantly with proper text contrast

## Tech Stack

- **Next.js 15** with App Router and Turbopack
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **React 19** with modern hooks

## Architecture

- **ColorVisualizer**: Main component with 2-column responsive layout
- **Color Utilities**: Centralized conversion and validation logic
- **State Management**: Sophisticated sync system preventing update loops
- **Accessibility**: Automatic text contrast based on color luminance
