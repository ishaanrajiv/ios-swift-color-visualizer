# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Swift Color Visualizer web application built with Next.js 15 and TypeScript. It allows developers to parse Swift Color syntax (`Color(red: X, green: Y, blue: Z)`) and visualize the colors with real-time preview and bidirectional synchronization between text input and visual color picker.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Install dependencies
npm install
```

Development server runs on http://localhost:3000

## Architecture

### Core Components
- **ColorVisualizer** (`app/components/ColorVisualizer.tsx`) - Main application component with 2-column layout
  - Left: Swift code input with validation, color values display, and quick guide
  - Right: Visual color preview with integrated color picker

### State Management Pattern
The app uses sophisticated state synchronization to prevent update loops:
- `input` - Swift color code string
- `color` - Parsed SwiftColor object 
- `pickerValue` - Color picker hex value (separate from calculated hex)
- `isUpdatingFromPicker` - Flag to prevent circular updates between text input and color picker

### Color Utilities (`app/utils/colorUtils.ts`)
Centralized color conversion and validation logic:
- `parseSwiftColor()` - Regex-based parsing with validation and error messages
- Bidirectional conversion: Swift ↔ RGB ↔ HEX ↔ CSS
- `calculateLuminance()` and `getContrastColor()` for accessibility
- Decimal precision handling (0-1 range for Swift, rounded integers for RGB)

### Styling Architecture
- **Tailwind CSS v4** with custom CSS variables in `globals.css`
- **Glassmorphism design** - backdrop-blur effects with dark theme (black background)
- **Modern card-based layout** with hover effects and gradient accents
- **Responsive 2-column grid** (collapses on mobile)

### Key Features
- **Real-time validation** with specific error messaging
- **Bidirectional sync** between Swift code input and visual color picker  
- **Copy-to-clipboard** functionality with visual feedback
- **Accessibility-aware** text contrast based on color luminance
- **Hover tooltips** for truncated text display

## Important Implementation Details

- Color picker uses separate state (`pickerValue`) to prevent flickering during updates
- Swift color values are constrained to 0-1 decimal range with 3 decimal precision
- Regex pattern allows flexible whitespace in Swift color syntax
- Error states don't disable color picker - it maintains last valid color
- Layout prevents text wrapping while maximizing space usage for long Swift color strings