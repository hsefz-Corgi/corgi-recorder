import { BrowserWindow } from 'electron';
import type { CorgiConfig } from '../utils/loadConfig';
import path from 'path';

export default function showProgressWindow(config: CorgiConfig) {
    const window = new BrowserWindow({
        height: 120,
        width: 500,
        resizable: false,
        maximizable: false,
        minimizable: false,
        skipTaskbar: true,
        webPreferences: {
            preload: path.join(import.meta.dirname, 'index.mjs')
        },
        show: false
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        window.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/progress`);
    } else {
        window.loadFile(`dist/index.html#/progress`);
    }
    window.setMenu(null);

    if (config.features.alwaysOnTop.enabled) window.setAlwaysOnTop(true, 'screen-saver');
    window.on('ready-to-show', () => window.show());
    window.setPosition(200, 200);

    return {
        close: () => window.close(),
        updateProgress: (progress: number) => window.webContents.executeJavaScript(`window.cp = ${progress}`)
    }
}
