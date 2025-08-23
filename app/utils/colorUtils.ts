export interface SwiftColor {
  red: number;
  green: number;
  blue: number;
}

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export interface ParseResult {
  color: SwiftColor | null;
  error: string | null;
}

export function parseSwiftColor(input: string): ParseResult {
  const trimmed = input.trim();
  
  if (!trimmed) {
    return { color: null, error: null };
  }

  const swiftColorRegex = /^Color\(\s*red:\s*([0-9]*\.?[0-9]+)\s*,\s*green:\s*([0-9]*\.?[0-9]+)\s*,\s*blue:\s*([0-9]*\.?[0-9]+)\s*\)$/i;
  
  const match = trimmed.match(swiftColorRegex);
  
  if (!match) {
    return {
      color: null,
      error: 'Invalid format. Use: Color(red: 0.1, green: 0.2, blue: 0.3)'
    };
  }

  const red = parseFloat(match[1]);
  const green = parseFloat(match[2]);
  const blue = parseFloat(match[3]);

  if (isNaN(red) || isNaN(green) || isNaN(blue)) {
    return {
      color: null,
      error: 'Invalid number values in color definition'
    };
  }

  if (red < 0 || red > 1 || green < 0 || green > 1 || blue < 0 || blue > 1) {
    return {
      color: null,
      error: 'Color values must be between 0 and 1'
    };
  }

  return {
    color: { red, green, blue },
    error: null
  };
}

export function swiftToRGB(color: SwiftColor): RGBColor {
  return {
    r: Math.round(color.red * 255),
    g: Math.round(color.green * 255),
    b: Math.round(color.blue * 255)
  };
}

export function swiftToHex(color: SwiftColor): string {
  const rgb = swiftToRGB(color);
  const toHex = (n: number) => n.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

export function hexToSwift(hex: string): SwiftColor {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);
  
  return {
    red: +(r / 255).toFixed(3),
    green: +(g / 255).toFixed(3),
    blue: +(b / 255).toFixed(3)
  };
}

export function swiftToCSS(color: SwiftColor): string {
  const rgb = swiftToRGB(color);
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export function calculateLuminance(color: SwiftColor): number {
  const sRGB = [color.red, color.green, color.blue].map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

export function getContrastColor(color: SwiftColor): string {
  const luminance = calculateLuminance(color);
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function formatSwiftColor(color: SwiftColor): string {
  return `Color(red: ${color.red}, green: ${color.green}, blue: ${color.blue})`;
}