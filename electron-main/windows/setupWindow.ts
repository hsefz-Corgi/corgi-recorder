import { app, BrowserWindow, screen } from 'electron';
import type { CorgiConfig } from '../utils/loadConfig';
import path from 'path';

export default async function startSetupWindow() {
    return new Promise<void>(resolve => {
        const window = new BrowserWindow({
            width: 1920,
            height: 1080,
            webPreferences: {
                preload: path.join(import.meta.dirname, 'index.mjs')
            }
        });

        if (process.env.VITE_DEV_SERVER_URL) {
            window.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/setup`);
        } else {
            window.loadFile(`dist/index.html#/setup`);
        }
        window.setMenu(null);

        window.setAlwaysOnTop(true, 'screen-saver');

        window.setFullScreen(true);
        window.setFullScreenable(false);
        window.on('closed', resolve);
    });

}
