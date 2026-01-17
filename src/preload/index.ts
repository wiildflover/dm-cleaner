import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

const api = {
    discoverTokens: () => ipcRenderer.invoke('discover-tokens'),
    validateToken: (token: string) => ipcRenderer.invoke('validate-token', token),
    minimize: () => ipcRenderer.send('window-minimize'),
    maximize: () => ipcRenderer.send('window-maximize'),
    close: () => ipcRenderer.send('window-close'),
    resizeWindow: (width: number, height: number) => ipcRenderer.send('window-resize', width, height)
}

if (process.contextIsolated) {
    try {
        contextBridge.exposeInMainWorld('electron', electronAPI)
        contextBridge.exposeInMainWorld('api', api)
    } catch (error) {
        console.error(error)
    }
} else {
    // @ts-ignore (define in window typing)
    window.electron = electronAPI
    // @ts-ignore
    window.api = api
}
