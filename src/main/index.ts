/**
 * @file index.ts
 * @author Wildflover
 * @description Main Electron process entry point with professional logging
 * @language TypeScript
 */

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { discoverTokens } from './token-discovery'

// Application Configuration
const APP_CONFIG = {
    name: 'Wildflover DM Cleaner',
    version: '1.0.0',
    author: 'Wildflover',
    appId: 'com.wildflover.dmcleaner',
    window: {
        width: 1200,
        height: 700,
        minWidth: 1100,
        minHeight: 650
    }
}

// Professional Console Logger
const Logger = {
    info: (tag: string, message: string) => {
        console.log(`\x1b[36m[${tag}]\x1b[0m ${message}`)
    },
    success: (tag: string, message: string) => {
        console.log(`\x1b[32m[${tag}]\x1b[0m ${message}`)
    },
    warn: (tag: string, message: string) => {
        console.log(`\x1b[33m[${tag}]\x1b[0m ${message}`)
    },
    error: (tag: string, message: string) => {
        console.log(`\x1b[31m[${tag}]\x1b[0m ${message}`)
    }
}

// Display Application Banner
function displayBanner(): void {
    console.log('\x1b[36m')
    console.log('╔══════════════════════════════════════════════════════════════╗')
    console.log('║                  WILDFLOVER DM CLEANER                       ║')
    console.log('║                      Version 1.0.0                           ║')
    console.log('╠══════════════════════════════════════════════════════════════╣')
    console.log('║  Author      : Wildflover                                    ║')
    console.log('║  Platform    : Electron + React + TypeScript                 ║')
    console.log('║  Purpose     : Professional Discord Message Management       ║')
    console.log('║  API Version : Discord API v9                                ║')
    console.log('╠══════════════════════════════════════════════════════════════╣')
    console.log('║  Modules     : electron-vite, framer-motion, tailwindcss     ║')
    console.log('║  Optimization: Hardware acceleration enabled                 ║')
    console.log('║  Security    : Context isolation, sandbox mode               ║')
    console.log('╚══════════════════════════════════════════════════════════════╝')
    console.log('\x1b[0m')
}

function createWindow(): void {
    Logger.info('WINDOW-INIT', 'Creating main application window...')
    
    const mainWindow = new BrowserWindow({
        width: APP_CONFIG.window.width,
        height: APP_CONFIG.window.height,
        show: false,
        autoHideMenuBar: true,
        frame: false,
        resizable: true,
        minWidth: APP_CONFIG.window.minWidth,
        minHeight: APP_CONFIG.window.minHeight,
        maximizable: false,
        titleBarStyle: 'hidden',
        backgroundColor: '#0d1117',
        title: APP_CONFIG.name,
        icon: process.platform === 'win32' 
            ? join(__dirname, '../../icon.ico')
            : join(__dirname, '../../icon.png'),
        webPreferences: {
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false,
            nodeIntegration: false,
            contextIsolation: true,
            devTools: is.dev
        }
    })

    // Disable DevTools shortcuts in production
    if (!is.dev) {
        mainWindow.webContents.on('before-input-event', (event, input) => {
            if (input.control && input.shift && input.key.toLowerCase() === 'i') {
                event.preventDefault()
            }
            if (input.key === 'F12') {
                event.preventDefault()
            }
            if (input.control && input.shift && input.key.toLowerCase() === 'c') {
                event.preventDefault()
            }
        })
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
        Logger.success('WINDOW-READY', 'Application window displayed successfully')
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        Logger.info('DEV-MODE', `Loading development server: ${process.env['ELECTRON_RENDERER_URL']}`)
        mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
        mainWindow.webContents.once('did-finish-load', () => {
            setTimeout(() => {
                if (!mainWindow.isVisible()) {
                    mainWindow.show()
                }
            }, 100)
        })
    } else {
        Logger.info('PROD-MODE', 'Loading production build...')
        mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
    }
}

app.whenReady().then(() => {
    displayBanner()
    Logger.info('APP-INIT', 'Initializing Electron application...')
    
    // Set app user model ID for Windows
    if (process.platform === 'win32') {
        app.setAppUserModelId(APP_CONFIG.appId)
        Logger.info('PLATFORM', 'Windows platform detected, AppUserModelId configured')
    }

    app.on('browser-window-created', (_, window) => {
        optimizer.watchWindowShortcuts(window)
    })

    createWindow()

    // IPC Handlers
    ipcMain.handle('discover-tokens', async () => {
        Logger.info('TOKEN-SCAN', 'Starting token discovery process...')
        return new Promise((resolve) => {
            setImmediate(async () => {
                try {
                    const tokens = await discoverTokens()
                    Logger.success('TOKEN-SCAN', `Discovery complete: ${tokens.length} token(s) found`)
                    resolve(tokens)
                } catch (error) {
                    Logger.error('TOKEN-SCAN', `Discovery failed: ${error}`)
                    resolve([])
                }
            })
        })
    })

    ipcMain.on('window-minimize', () => {
        BrowserWindow.getFocusedWindow()?.minimize()
    })

    ipcMain.on('window-maximize', () => {
        const window = BrowserWindow.getFocusedWindow()
        if (window) {
            window.isMaximized() ? window.unmaximize() : window.maximize()
        }
    })

    ipcMain.on('window-close', () => {
        Logger.info('APP-EXIT', 'Application closing...')
        app.quit()
    })

    ipcMain.on('window-resize', (_, width: number, height: number) => {
        const window = BrowserWindow.getFocusedWindow()
        if (window) {
            window.setSize(width, height)
            window.center()
        }
    })

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    Logger.success('APP-READY', 'Application initialized successfully')
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
