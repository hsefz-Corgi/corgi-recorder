import { BrowserWindow } from 'electron';

export default async function playVideo(path: string) {
    return new Promise<void>(resolve => {
        const window = new BrowserWindow({
            width: 800,
            height: 450,
            show: false
        });
        window.setAlwaysOnTop(true, 'dock');
        window.loadFile(path);
        window.setMenu(null);
        window.on('ready-to-show', () => window.show());
        window.on('closed', resolve);
        window.title = path;
    });
}
