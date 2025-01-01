import { app, BrowserWindow, dialog } from 'electron';
import type { CorgiConfig } from '../utils/loadConfig';
import path from 'path';

import { logger } from '../utils/configureLog';

import * as recorder from '../record/record';
import showError from './errorWindow';

export default async function startMainWindow(config: CorgiConfig) {
    return new Promise<void>(resolve => {
        const window = new BrowserWindow({
            width: 180,
            height: 92,
            webPreferences: {
                preload: path.join(import.meta.dirname, 'index.mjs'),
                webSecurity: false
            },
            show: false,
            minimizable: false,
            maximizable: false,
            resizable: false
        });

        if (process.env.VITE_DEV_SERVER_URL) {
            window.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/record`);
        } else {
            window.loadFile(`dist/record.html`);
        }
        window.setMenu(null);
        window.setPosition(400, 20);

        if (!app.isPackaged || process.argv.includes('--devtools')) window.webContents.openDevTools({
            mode: 'undocked'
        });
        if (config.features.alwaysOnTop.enabled) window.setAlwaysOnTop(true, 'screen-saver');
        window.on('ready-to-show', () => window.show());
        window.on('close', (e) => {
            if (config.features.denyQuittingWhenRecording && recorder.isRecording()) {
                logger.warn('Reject to close main window because of recording.');
                e.preventDefault();
                showError('录屏中，无法关闭');

            } else if (config.features.denyQuittingWhenExporting && recorder.isExporting()) {
                logger.warn('Reject to close main window because of exporting.');
                e.preventDefault();
                showError('导出文件中，无法关闭');

            } else if (!config.features.allowToExit.enabled) {
                logger.warn('Reject to close main window because of no permission.');
                e.preventDefault();
                dialog.showErrorBox(config.software.title, '你所在的用户组无权限关闭此软件。');
            }
        });
        window.on('closed', resolve);
    });
}
