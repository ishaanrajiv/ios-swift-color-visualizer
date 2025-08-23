'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { 
  parseSwiftColor, 
  swiftToHex, 
  swiftToRGB, 
  swiftToCSS, 
  getContrastColor, 
  hexToSwift, 
  formatSwiftColor,
  SwiftColor 
} from '../utils/colorUtils';

export default function ColorVisualizer() {
  const [input, setInput] = useState('Color(red: 0.2, green: 0.6, blue: 1.0)');
  const [color, setColor] = useState<SwiftColor | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateColor = (newInput: string) => {
    const result = parseSwiftColor(newInput);
    setColor(result.color);
    setError(result.error);
  };

  useEffect(() => {
    updateColor(input);
  }, [input]);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const swiftColor = hexToSwift(hex);
    const formattedSwift = formatSwiftColor(swiftColor);
    setInput(formattedSwift);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const rgb = color ? swiftToRGB(color) : null;
  const hex = color ? swiftToHex(color) : null;
  const cssColor = color ? swiftToCSS(color) : null;
  const textColor = color ? getContrastColor(color) : '#FFFFFF';

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-4">
            Swift Color Visualizer
          </h1>
          <p className="text-gray-300 text-lg">
            Parse and visualize Swift Color syntax with real-time preview
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div>
              <label htmlFor="swift-input" className="block text-sm font-medium text-gray-200 mb-2">
                Swift Color Code
              </label>
              <textarea
                id="swift-input"
                value={input}
                onChange={handleInputChange}
                className="w-full h-32 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-300"
                placeholder="Color(red: 0.1, green: 0.2, blue: 0.3)"
              />
              <div className={`mt-2 transition-opacity duration-300 ${error ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-red-400 text-sm">{error || ' '}</p>
              </div>
            </div>

            <div>
              <label htmlFor="color-picker" className="block text-sm font-medium text-gray-200 mb-2">
                Color Picker
              </label>
              <input
                id="color-picker"
                type="color"
                value={hex || '#000000'}
                onChange={handleColorPickerChange}
                disabled={!color}
                className="w-full h-12 rounded-lg border border-gray-700 bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              />
            </div>
          </div>

          {/* Display Section */}
          <div className="space-y-6">
            {/* Color Swatch */}
            <div className="aspect-square w-full rounded-2xl border border-gray-700 overflow-hidden transition-all duration-500">
              <div
                className="w-full h-full flex items-center justify-center text-2xl font-bold transition-all duration-500"
                style={{
                  backgroundColor: cssColor || '#374151',
                  color: textColor
                }}
              >
                {color ? (
                  <div className="text-center">
                    <div>Swift Color</div>
                    <div className="text-lg font-normal mt-1">Preview</div>
                  </div>
                ) : (
                  <div className="text-gray-400 text-center">
                    <div>Enter Valid</div>
                    <div className="text-lg font-normal mt-1">Swift Color</div>
                  </div>
                )}
              </div>
            </div>

            {/* Color Information */}
            {color && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-semibold text-gray-100 mb-4">Color Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">RGB:</span>
                    <button
                      onClick={() => copyToClipboard(`rgb(${rgb!.r}, ${rgb!.g}, ${rgb!.b})`)}
                      className="text-indigo-400 hover:text-indigo-300 font-mono transition-colors cursor-pointer"
                    >
                      rgb({rgb!.r}, {rgb!.g}, {rgb!.b})
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hex:</span>
                    <button
                      onClick={() => copyToClipboard(hex!)}
                      className="text-indigo-400 hover:text-indigo-300 font-mono transition-colors cursor-pointer"
                    >
                      {hex}
                    </button>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Swift:</span>
                    <button
                      onClick={() => copyToClipboard(formatSwiftColor(color))}
                      className="text-indigo-400 hover:text-indigo-300 font-mono text-right transition-colors cursor-pointer text-sm"
                    >
                      Color(red: {color.red}, green: {color.green}, blue: {color.blue})
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Usage Guide */}
        <div className="mt-12 bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-gray-100 mb-3">Usage Guide</h3>
          <ul className="text-gray-300 space-y-2 text-sm">
            <li>• Enter Swift Color syntax: <code className="bg-gray-700 px-2 py-1 rounded text-indigo-300">Color(red: 0.1, green: 0.2, blue: 0.3)</code></li>
            <li>• Values must be between 0 and 1 (decimal format)</li>
            <li>• Use the color picker to visually select colors</li>
            <li>• Click any color value to copy it to clipboard</li>
            <li>• Real-time validation and error reporting</li>
          </ul>
        </div>
      </div>
    </div>
  );
}