import { app, BrowserWindow, ipcMain } from 'electron';
import { readConfig, type CorgiConfig } from '../utils/loadConfig';
import path from 'path';

import * as lock from '../utils/lock';

export default async function startConfigWindow(config: CorgiConfig) {
    if (lock.detect('config-window')) return new Promise<void>(resolve => {
        resolve();
    });
    lock.request('config-window');
    return new Promise<void>(resolve => {
        const window = new BrowserWindow({
            width: 650,
            height: 800,
            webPreferences: {
                preload: path.join(import.meta.dirname, 'index.mjs'),
                webSecurity: false
            },
            show: false,
            minimizable: false
        });

        if (process.env.VITE_DEV_SERVER_URL) {
            window.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/config`);
        } else {
            window.loadFile(`dist/config.html`);
        }
        window.setMenu(null);

        if (!app.isPackaged || process.argv.includes('--devtools')) window.webContents.openDevTools({
            mode: 'undocked'
        });
        if (config.features.alwaysOnTop.enabled) window.setAlwaysOnTop(true, 'screen-saver');
        window.on('ready-to-show', () => window.show());
        window.on('closed', () => {
            lock.release('config-window');
            return resolve();
        });
    });
}

export function registerConfigWindowIpcHandler() {
    ipcMain.handle('page:open:config', async () => startConfigWindow((await readConfig()).data));
}
