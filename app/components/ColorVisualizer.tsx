'use client';

import { useState, useEffect, ChangeEvent, useCallback } from 'react';
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

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function ColorVisualizer() {
  const [input, setInput] = useState('Color(red: 0.2, green: 0.6, blue: 1.0)');
  const [color, setColor] = useState<SwiftColor | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [pickerValue, setPickerValue] = useState('#3399FF');
  const [isUpdatingFromPicker, setIsUpdatingFromPicker] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateColor = useCallback((newInput: string) => {
    const result = parseSwiftColor(newInput);
    setColor(result.color);
    setError(result.error);

    if (!isUpdatingFromPicker && result.color) {
      const newHex = swiftToHex(result.color);
      setPickerValue(newHex);
    }
  }, [isUpdatingFromPicker]);

  useEffect(() => {
    updateColor(input);
  }, [input, updateColor]);

  useEffect(() => {
    const result = parseSwiftColor(input);
    if (result.color) {
      const initialHex = swiftToHex(result.color);
      setPickerValue(initialHex);
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setIsUpdatingFromPicker(false);
    setInput(e.target.value);
  };

  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setPickerValue(hex);
    setIsUpdatingFromPicker(true);

    const swiftColor = hexToSwift(hex);
    const formattedSwift = formatSwiftColor(swiftColor);
    setInput(formattedSwift);

    setTimeout(() => setIsUpdatingFromPicker(false), 100);
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

  // Derive subtle accent from the current color for page atmosphere
  const accentGlow = color
    ? `rgba(${Math.round(color.red * 255)}, ${Math.round(color.green * 255)}, ${Math.round(color.blue * 255)}, 0.06)`
    : 'transparent';

  if (!mounted) return null;

  return (
    <div className="grain-overlay min-h-screen relative" style={{ background: 'var(--background)' }}>
      {/* Ambient color glow */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000 ease-out"
        style={{
          background: color
            ? `radial-gradient(ellipse 80% 60% at 60% 20%, ${accentGlow}, transparent 70%)`
            : 'none'
        }}
      />

      <div className="relative z-10 min-h-screen w-full flex flex-col">
        {/* Top bar */}
        <header className="animate-page-in flex items-center justify-between px-5 sm:px-8 lg:px-10 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-3.5 h-3.5 rounded-full transition-colors duration-500 shadow-sm"
              style={{ backgroundColor: cssColor || 'var(--border-strong)' }}
            />
            <span className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Swift Color
            </span>
          </div>
          <span className="text-[10px] tracking-[0.2em] uppercase font-medium" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
            Visualizer
          </span>
        </header>

        {/* Main Content — adaptive 3-col grid */}
        <main className="flex-1 px-5 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 max-w-[1600px] mx-auto w-full">
          {/* Title row */}
          <div className="animate-slide-up delay-1 mb-6 sm:mb-8 lg:mb-10">
            <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
              Visualize your Swift colors
            </h1>
            <p className="mt-2 text-sm sm:text-base max-w-lg leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              Paste Swift Color syntax, pick visually, copy any format.
            </p>
          </div>

          {/* 3-column grid: Input | Preview | Values+Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(280px,1fr)_minmax(320px,1.4fr)_minmax(240px,1fr)] gap-5 sm:gap-6 lg:gap-8 items-start">

            {/* Column 1 — Swift Code Input */}
            <div className="space-y-4 animate-slide-up delay-2">
              <label
                className="block text-[11px] font-medium tracking-widest uppercase"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
              >
                Swift Code
              </label>
              <div className="relative rounded-xl overflow-hidden" style={{ border: '1.5px solid var(--border)' }}>
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  className="w-full h-40 md:h-52 xl:h-64 px-4 py-4 text-sm leading-relaxed resize-none focus:outline-none focus-ring transition-colors duration-200"
                  style={{
                    background: 'var(--surface)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-mono)',
                  }}
                  placeholder="Color(red: 0.1, green: 0.2, blue: 0.3)"
                  spellCheck={false}
                />
                <div
                  className="absolute bottom-3 right-3 text-[10px] font-medium tracking-wider uppercase px-2 py-0.5 rounded-md"
                  style={{
                    background: 'var(--background)',
                    color: 'var(--text-tertiary)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  Swift
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm animate-fade-in"
                  style={{
                    background: 'rgba(196, 72, 62, 0.06)',
                    border: '1px solid rgba(196, 72, 62, 0.15)',
                    color: 'var(--error)',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--error)' }} />
                  {error}
                </div>
              )}

              {/* Syntax Hint */}
              <div
                className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-sm leading-relaxed"
                style={{
                  background: 'var(--accent-soft)',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span className="mt-0.5 text-base leading-none" style={{ opacity: 0.5 }}>?</span>
                <span>
                  Values range from <strong className="font-semibold" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8em' }}>0.0</strong> to <strong className="font-semibold" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8em' }}>1.0</strong> — click any value row to copy.
                </span>
              </div>
            </div>

            {/* Column 2 — Color Preview + Picker */}
            <div className="animate-slide-up delay-3">
              <label
                className="block text-[11px] font-medium tracking-widest uppercase mb-4"
                style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
              >
                Preview
              </label>
              <div
                className="rounded-2xl overflow-hidden transition-all duration-500"
                style={{ border: '1.5px solid var(--border)' }}
              >
                {/* Main color swatch */}
                <div
                  className="relative w-full aspect-[4/3] md:aspect-[16/12] flex items-end justify-between p-5 sm:p-6 transition-colors duration-500"
                  style={{
                    backgroundColor: cssColor || 'var(--surface)',
                    color: textColor,
                  }}
                >
                  {color ? (
                    <>
                      <div>
                        <div
                          className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-none"
                          style={{ opacity: 0.9 }}
                        >
                          {hex}
                        </div>
                        <div
                          className="mt-2 text-xs sm:text-sm tracking-wide"
                          style={{ opacity: 0.5, fontFamily: 'var(--font-body)' }}
                        >
                          rgb({rgb!.r}, {rgb!.g}, {rgb!.b})
                        </div>
                      </div>
                      <div
                        className="text-[10px] font-medium tracking-widest uppercase"
                        style={{ opacity: 0.35, fontFamily: 'var(--font-body)' }}
                      >
                        Swift Color
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-center py-12" style={{ color: 'var(--text-tertiary)' }}>
                      <div className="text-center">
                        <div className="font-[family-name:var(--font-display)] text-2xl font-semibold tracking-tight" style={{ opacity: 0.4 }}>
                          No color
                        </div>
                        <div className="mt-1 text-xs" style={{ opacity: 0.3, fontFamily: 'var(--font-body)' }}>
                          Enter valid Swift Color syntax
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Picker strip */}
                <div
                  className="px-5 sm:px-6 py-4 flex items-center gap-4"
                  style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}
                >
                  <input
                    type="color"
                    value={pickerValue}
                    onChange={handleColorPickerChange}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl cursor-pointer flex-shrink-0 transition-transform duration-200 hover:scale-105"
                    style={{ background: 'transparent' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                      Visual Picker
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                      Click the swatch to choose a color
                    </div>
                  </div>
                  {color && (
                    <div
                      className="text-xs tabular-nums hidden sm:block"
                      style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}
                    >
                      {hex}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Column 3 — Color Values + Channels */}
            <div className="space-y-5 animate-slide-up delay-4 md:col-span-2 xl:col-span-1">
              {/* Color Values */}
              {color ? (
                <>
                  <div>
                    <label
                      className="block text-[11px] font-medium tracking-widest uppercase mb-4"
                      style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
                    >
                      Color Values
                    </label>
                    <div className="rounded-xl overflow-hidden" style={{ border: '1.5px solid var(--border)' }}>
                      {/* RGB Row */}
                      <button
                        onClick={() => copyToClipboard(`rgb(${rgb!.r}, ${rgb!.g}, ${rgb!.b})`, 'RGB')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 group ${copied === 'RGB' ? 'copy-success' : ''}`}
                        style={{
                          background: copied === 'RGB' ? 'rgba(45, 138, 86, 0.06)' : 'var(--surface)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                          RGB
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                            rgb({rgb!.r}, {rgb!.g}, {rgb!.b})
                          </span>
                          {copied === 'RGB' ? (
                            <CheckIcon className="text-[var(--success)]" />
                          ) : (
                            <CopyIcon className="opacity-0 group-hover:opacity-40 transition-opacity" />
                          )}
                        </span>
                      </button>

                      {/* HEX Row */}
                      <button
                        onClick={() => copyToClipboard(hex!, 'HEX')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 group ${copied === 'HEX' ? 'copy-success' : ''}`}
                        style={{
                          background: copied === 'HEX' ? 'rgba(45, 138, 86, 0.06)' : 'var(--surface)',
                          borderBottom: '1px solid var(--border)',
                        }}
                      >
                        <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                          HEX
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="text-sm" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                            {hex}
                          </span>
                          {copied === 'HEX' ? (
                            <CheckIcon className="text-[var(--success)]" />
                          ) : (
                            <CopyIcon className="opacity-0 group-hover:opacity-40 transition-opacity" />
                          )}
                        </span>
                      </button>

                      {/* Swift Row */}
                      <button
                        onClick={() => copyToClipboard(formatSwiftColor(color), 'Swift')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-150 group ${copied === 'Swift' ? 'copy-success' : ''}`}
                        style={{
                          background: copied === 'Swift' ? 'rgba(45, 138, 86, 0.06)' : 'var(--surface)',
                        }}
                      >
                        <span className="text-xs font-medium tracking-wider uppercase flex-shrink-0" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                          Swift
                        </span>
                        <span className="flex items-center gap-2 min-w-0 ml-4">
                          <span
                            className="text-sm truncate"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
                            title={formatSwiftColor(color)}
                          >
                            Color(red: {color.red}, green: {color.green}, blue: {color.blue})
                          </span>
                          {copied === 'Swift' ? (
                            <CheckIcon className="text-[var(--success)] flex-shrink-0" />
                          ) : (
                            <CopyIcon className="opacity-0 group-hover:opacity-40 transition-opacity flex-shrink-0" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Channels */}
                  <div className="animate-fade-in">
                    <label
                      className="block text-[11px] font-medium tracking-widest uppercase mb-4"
                      style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}
                    >
                      Channels
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { label: 'Red', value: color.red, byte: rgb!.r, barColor: '#E05A4E' },
                        { label: 'Green', value: color.green, byte: rgb!.g, barColor: '#3BA55C' },
                        { label: 'Blue', value: color.blue, byte: rgb!.b, barColor: '#4A8FE7' },
                      ].map((ch) => (
                        <div
                          key={ch.label}
                          className="rounded-xl p-3.5"
                          style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}
                        >
                          <div className="text-[10px] font-medium tracking-wider uppercase mb-2" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                            {ch.label}
                          </div>
                          <div className="text-lg font-semibold tabular-nums" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                            {ch.value}
                          </div>
                          <div className="text-[10px] mt-0.5 tabular-nums" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {ch.byte}
                          </div>
                          {/* Mini bar */}
                          <div className="mt-2.5 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                            <div
                              className="h-full rounded-full transition-all duration-500 ease-out"
                              style={{
                                width: `${ch.value * 100}%`,
                                background: ch.barColor,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-xl p-6 text-center" style={{ background: 'var(--surface)', border: '1.5px solid var(--border)' }}>
                  <div className="text-sm" style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-body)' }}>
                    Enter a valid color to see values
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer
          className="animate-slide-up delay-5 px-5 sm:px-8 lg:px-10 py-5 border-t mt-auto flex items-center justify-between"
          style={{ borderColor: 'var(--border)', fontFamily: 'var(--font-body)' }}
        >
          <span className="text-[11px] tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
            Swift Color Visualizer
          </span>
          <span className="text-[11px] tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
            Built for iOS developers
          </span>
        </footer>
      </div>
    </div>
  );
}
