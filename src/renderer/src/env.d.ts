/// <reference types="vite/client" />

/**
 * @file env.d.ts
 * @author Wildflover
 * @description TypeScript environment declarations for Vite and Electron
 * @language TypeScript
 */

declare module '*.svg' {
    const content: string;
    export default content;
}

declare module '*.jpg' {
    const content: string;
    export default content;
}

declare module '*.jpeg' {
    const content: string;
    export default content;
}

declare module '*.png' {
    const content: string;
    export default content;
}

interface Window {
    electron: {
        ipcRenderer: {
            send: (channel: string, ...args: any[]) => void;
            on: (channel: string, func: (...args: any[]) => void) => void;
            once: (channel: string, func: (...args: any[]) => void) => void;
        };
    };
    api: {
        resizeWindow: (width: number, height: number) => void;
        discoverTokens: () => Promise<string[]>;
        minimize: () => void;
        close: () => void;
    }
}
