/**
 * @file tailwind.config.js
 * @author Wildflover
 * @description Tailwind CSS configuration with blue gradient theme palette
 * @language JavaScript
 */

export default {
    content: [
        "./src/renderer/index.html",
        "./src/renderer/src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Wildflover Blue Gradient Theme
                wf: {
                    // Primary Blue Gradient Colors
                    blue: {
                        50: '#eff6ff',
                        100: '#dbeafe',
                        200: '#bfdbfe',
                        300: '#93c5fd',
                        400: '#60a5fa',
                        500: '#3b82f6',
                        600: '#2563eb',
                        700: '#1d4ed8',
                        800: '#1e40af',
                        900: '#1e3a8a',
                        950: '#172554'
                    },
                    // Accent Indigo
                    indigo: {
                        400: '#818cf8',
                        500: '#6366f1',
                        600: '#4f46e5'
                    },
                    // Accent Violet
                    violet: {
                        400: '#a78bfa',
                        500: '#8b5cf6',
                        600: '#7c3aed'
                    }
                },
                
                // Discord Base Colors (preserved for compatibility)
                discord: {
                    blurple: '#5865F2',
                    green: '#57F287',
                    yellow: '#FEE75C',
                    fuchsia: '#EB459E',
                    red: '#ED4245',
                    dark: '#1e1f22',
                    darker: '#2b2d31',
                    black: '#111214',
                    gray: '#313338',

                    // Dark Theme Base
                    obsidian: '#09090b',
                    surface: '#18181b',
                    surfaceHover: '#27272a',
                    border: '#27272a',
                    subtle: '#a1a1aa',

                    // Primary Accent (Blue Gradient)
                    primary: '#3b82f6',
                    primaryHover: '#2563eb',
                    primaryLight: '#60a5fa'
                }
            },
            fontFamily: {
                ggsans: ['"gg sans"', 'sans-serif'],
                display: ['"Inter"', 'sans-serif'],
            },
            backgroundImage: {
                // Blue Gradient Presets
                'wf-gradient': 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
                'wf-gradient-soft': 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(99, 102, 241, 0.8) 50%, rgba(139, 92, 246, 0.8) 100%)',
                'wf-gradient-dark': 'linear-gradient(135deg, #1e40af 0%, #4f46e5 50%, #7c3aed 100%)',
                'wf-gradient-radial': 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.3) 0%, transparent 70%)',
            },
            boxShadow: {
                'wf-glow': '0 0 20px rgba(59, 130, 246, 0.3)',
                'wf-glow-lg': '0 0 40px rgba(59, 130, 246, 0.4)',
                'wf-glow-sm': '0 0 10px rgba(59, 130, 246, 0.2)',
            },
            animation: {
                'gradient-shift': 'gradientShift 8s ease infinite',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                }
            }
        },
    },
    plugins: [],
}
