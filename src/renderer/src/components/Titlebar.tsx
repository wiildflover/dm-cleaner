/**
 * @file Titlebar.tsx
 * @author Wildflover
 * @description Custom window titlebar component with blue gradient theme
 * @language TypeScript/React
 */

import { Minus, Maximize2, X } from 'lucide-react'
import iconImage from '../assets/icon.png'

declare global {
    interface Window {
        electron?: {
            ipcRenderer: {
                send: (channel: string, ...args: any[]) => void
            }
        }
    }
}

export default function Titlebar() {
    return (
        <div 
            className="h-8 bg-[#0d1117]/90 backdrop-blur-md border-b border-wf-blue-500/10 flex items-center justify-between px-3 select-none" 
            style={{ WebkitAppRegion: 'drag' } as any}
        >
            {/* App Identity */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <img 
                        src={iconImage} 
                        alt="Wildflover" 
                        className="w-4 h-4 rounded" 
                    />
                    <div className="absolute inset-0 rounded bg-gradient-to-br from-wf-blue-500/20 to-wf-violet-500/20 pointer-events-none" />
                </div>
                <span className="text-xs font-bold bg-gradient-to-r from-wf-blue-400 to-wf-indigo-400 bg-clip-text text-transparent">
                    Wildflover DM Cleaner
                </span>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
                <button
                    onClick={() => window.electron?.ipcRenderer.send('window-minimize')}
                    className="w-8 h-6 flex items-center justify-center hover:bg-wf-blue-500/20 rounded transition-colors group"
                >
                    <Minus className="w-3.5 h-3.5 text-slate-400 group-hover:text-wf-blue-400" />
                </button>
                <button
                    onClick={() => window.electron?.ipcRenderer.send('window-maximize')}
                    className="w-8 h-6 flex items-center justify-center hover:bg-wf-blue-500/20 rounded transition-colors group"
                >
                    <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-wf-blue-400" />
                </button>
                <button
                    onClick={() => window.electron?.ipcRenderer.send('window-close')}
                    className="w-8 h-6 flex items-center justify-center hover:bg-red-600 rounded transition-colors group"
                >
                    <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </button>
            </div>
        </div>
    )
}
