import { BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { logger } from '../utils/configureLog';

const errorBoxes: BrowserWindow[] = [];
const errorBoxesMaximumCount = 3;
let currentErrorBoxId = 0;
export default function showError(title: string, message: string) {
    if (errorBoxes.length == errorBoxesMaximumCount) {
        errorBoxes[currentErrorBoxId].show();
        errorBoxes[currentErrorBoxId].webContents.executeJavaScript(`window.showError('${title}', '${message}', ${currentErrorBoxId})`);
        currentErrorBoxId = (currentErrorBoxId + 1) % errorBoxesMaximumCount;
    } else {
        const window = new BrowserWindow({
            height: 400,
            width: 420,
            frame: false,
            resizable: false,
            maximizable: false,
            minimizable: false,
            skipTaskbar: true,
            webPreferences: {
                preload: path.join(import.meta.dirname, 'index.mjs'),
                webSecurity: false
            },
            show: false,
            transparent: true
        });
        window.setAlwaysOnTop(true, 'dock');

        const errorWindowId = errorBoxes.length;

        window.once('ready-to-show', () => {
            window.show();
            window.webContents.executeJavaScript(`window.showError('${title}', '${message}', ${errorWindowId})`);
        });
        window.on('close', (event) => {
            event.preventDefault();
            window.hide();
        });

        if (process.argv.includes('--devtools')) window.webContents.openDevTools({
            mode: 'undocked'
        });
        if (process.env.VITE_DEV_SERVER_URL) {
            window.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/error`);
        } else {
            window.loadFile(`dist/error.html`);
        }
        window.setMenu(null);

        errorBoxes.push(window);
    }
}

export function registerErrorBoxIpc() {
    ipcMain.handle('page:error:close', (_e, windowId: number) => {
        logger.info('Hide error box', windowId);
        errorBoxes[windowId].hide();
    });
}

export function closeAllErrorWindows() {
    currentErrorBoxId = 0;
    errorBoxes.forEach(window => window.close());
    errorBoxes.length = 0;
}
