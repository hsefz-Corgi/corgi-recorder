import { ipcMain, BrowserWindow } from 'electron';
import path from 'path';
import type { CorgiConfig } from '../utils/loadConfig';

import * as lock from '../utils/lock';

export default function requestCourseInfoInput(config: CorgiConfig) {
    return new Promise<{
        name: string;
        abstract: string;
    }>(async resolve => {
        await lock.waitForLock('course-info-input');
        const window = new BrowserWindow({
            width: 350,
            height: 230,
            webPreferences: {
                preload: path.join(import.meta.dirname, 'index.mjs'),
                webSecurity: false
            },
            show: false,
            minimizable: false,
            maximizable: false,
            resizable: false,
            closable: false
        });

        if (process.argv.includes('--devtools')) window.webContents.openDevTools({
            mode: 'undocked'
        });
        if (process.env.VITE_DEV_SERVER_URL) {
            window.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/input`);
        } else {
            window.loadFile(`dist/input.html`);
        }
        window.setMenu(null);

        if (config.features.alwaysOnTop.enabled) window.setAlwaysOnTop(true, 'screen-saver');
        window.on('ready-to-show', () => window.show());
        window.on('closed', () => lock.release('course-info-input'));

        ipcMain.handleOnce('page:input:sendData', (_e, name: string, abstract: string) => {
            resolve({
                name: name,
                abstract: abstract
            })
        });
    });
}
