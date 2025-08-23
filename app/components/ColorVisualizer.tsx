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
  const [copied, setCopied] = useState<string | null>(null);

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

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const rgb = color ? swiftToRGB(color) : null;
  const hex = color ? swiftToHex(color) : null;
  const cssColor = color ? swiftToCSS(color) : null;
  const textColor = color ? getContrastColor(color) : '#FFFFFF';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-black to-indigo-950/60"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/3 to-transparent"></div>
      </div>
      
      <div className="relative z-10 min-h-screen p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 mb-8">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-3 animate-pulse"></div>
              <span className="text-indigo-300 text-sm font-medium">Developer Tools</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-indigo-300 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Swift Color
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Visualizer
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Transform Swift Color syntax into beautiful visual previews with real-time parsing and instant feedback
            </p>
          </div>

          {/* Main Content */}
          <div className="grid xl:grid-cols-3 gap-8 mb-16">
            {/* Input Section */}
            <div className="xl:col-span-1 space-y-8">
              {/* Swift Input Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                <div className="relative bg-gray-950/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-100">Swift Code</h3>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={input}
                      onChange={handleInputChange}
                      className="w-full h-40 px-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-100 font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent resize-none transition-all duration-300 hover:bg-gray-800/70"
                      placeholder="Color(red: 0.1, green: 0.2, blue: 0.3)"
                    />
                    <div className="absolute top-3 right-3 text-xs text-gray-500 bg-gray-800/80 px-2 py-1 rounded">
                      Swift
                    </div>
                  </div>
                  
                  <div className={`mt-4 transition-all duration-300 ${error ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    <div className="flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Color Picker Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                <div className="relative bg-gray-950/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-100">Visual Picker</h3>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="color"
                      value={hex || '#000000'}
                      onChange={handleColorPickerChange}
                      disabled={!color}
                      className="w-full h-16 rounded-xl border-2 border-gray-700/50 bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:border-gray-600/50 transition-all duration-300"
                    />
                    {!color && (
                      <div className="absolute inset-0 bg-gray-800/80 rounded-xl flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Enter valid color first</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Color Preview */}
            <div className="xl:col-span-1">
              <div className="group relative h-full min-h-[500px]">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl transition-all duration-700 group-hover:blur-3xl"></div>
                <div className="relative h-full bg-gray-950/50 backdrop-blur-2xl border border-gray-800/40 rounded-3xl overflow-hidden">
                  <div
                    className="w-full h-full flex items-center justify-center text-3xl font-bold transition-all duration-700 relative"
                    style={{
                      backgroundColor: cssColor || '#1f2937',
                      color: textColor
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                    <div className="relative text-center z-10">
                      {color ? (
                        <div className="space-y-3">
                          <div className="text-4xl font-extrabold">Swift</div>
                          <div className="text-xl font-normal opacity-80">Color Preview</div>
                          <div className="text-sm opacity-60 font-mono">
                            {hex}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3 text-gray-400">
                          <div className="text-4xl font-extrabold">Enter</div>
                          <div className="text-xl font-normal">Valid Color</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Color Information */}
            <div className="xl:col-span-1 space-y-6">
              {color && (
                <>
                  <div className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                    <div className="relative bg-gray-950/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300">
                      <div className="flex items-center mb-6">
                        <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full mr-3"></div>
                        <h3 className="text-lg font-semibold text-gray-100">Color Values</h3>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="group/item flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                          <span className="text-gray-300 font-medium">RGB</span>
                          <button
                            onClick={() => copyToClipboard(`rgb(${rgb!.r}, ${rgb!.g}, ${rgb!.b})`, 'RGB')}
                            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-mono transition-all duration-200 hover:scale-105"
                          >
                            <span>rgb({rgb!.r}, {rgb!.g}, {rgb!.b})</span>
                            {copied === 'RGB' && <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">Copied!</span>}
                          </button>
                        </div>
                        
                        <div className="group/item flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                          <span className="text-gray-300 font-medium">HEX</span>
                          <button
                            onClick={() => copyToClipboard(hex!, 'HEX')}
                            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-mono transition-all duration-200 hover:scale-105"
                          >
                            <span>{hex}</span>
                            {copied === 'HEX' && <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">Copied!</span>}
                          </button>
                        </div>
                        
                        <div className="group/item flex justify-between items-center p-3 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all duration-200">
                          <span className="text-gray-300 font-medium">Swift</span>
                          <button
                            onClick={() => copyToClipboard(formatSwiftColor(color), 'Swift')}
                            className="flex items-center space-x-2 text-emerald-400 hover:text-emerald-300 font-mono text-right transition-all duration-200 hover:scale-105 max-w-48 text-sm"
                          >
                            <span className="truncate">Color(red: {color.red}, green: {color.green}, blue: {color.blue})</span>
                            {copied === 'Swift' && <span className="text-xs bg-emerald-500/20 px-2 py-1 rounded text-emerald-300">Copied!</span>}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Quick Guide */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl transition-all duration-500 group-hover:blur-2xl"></div>
                <div className="relative bg-gray-950/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-100">Quick Guide</h3>
                  </div>
                  
                  <div className="space-y-3 text-sm text-gray-300">
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                      <span>Use decimal values between 0.0 and 1.0</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                      <span>Click values to copy to clipboard</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                      <span>Use color picker for visual selection</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2"></div>
                      <span>Real-time validation and preview</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-gray-800/50 to-gray-700/50 border border-gray-600/30 backdrop-blur-xl">
              <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full mr-3"></div>
              <span className="text-gray-400 text-sm">Built for Swift developers with ❤️</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}