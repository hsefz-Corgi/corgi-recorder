import { app, BrowserWindow } from 'electron';
import path from 'node:path';

app.whenReady().then(() => {
    const win = new BrowserWindow({
        title: 'Main window',
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(__dirname, '../index.html'));
    }
})
