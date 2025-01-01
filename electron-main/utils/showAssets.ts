import { BrowserWindow } from 'electron';
import { logger } from './configureLog';

export default async function showAssets(path: string) {
    return new Promise<void>(resolve => {
        const window = new BrowserWindow({
            width: 800,
            height: 450,
            show: false
        });
        window.setAlwaysOnTop(true, 'screen-saver');
        window.setPosition(0, 0);
        if (path.includes('http') || path.includes('https')) {
            window.loadURL(path);
            logger.info('Show Remote Assets', path);
        } else {
            window.loadFile(path);
            logger.info('Show Local Assets', path);
        }
        window.setMenu(null);
        window.on('ready-to-show', () => window.show());
        window.on('closed', resolve);
        window.title = path;
    });
}
