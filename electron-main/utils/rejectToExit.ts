import { app, dialog } from 'electron';
import type { CorgiConfig } from '../utils/loadConfig';

import { logger } from './configureLog';
import { spawn, exec } from 'node:child_process';
export default function rejectToExit(config: CorgiConfig) {
    logger.info('Rejecting to exit service started.');
    app.on('will-quit', (e) => {
        e.preventDefault();
        logger.warn('Reject to quit because of no permission.');
        dialog.showErrorBox(config.software.title, '你所在的用户组无权限关闭此软件。');
    });
    app.on('before-quit', (e) => {
        e.preventDefault();
        logger.warn('Reject to quit because of no permission.');
        dialog.showErrorBox(config.software.title, '你所在的用户组无权限关闭此软件。');
    });
    setInterval(() => {
        let data = '';
        const tasklist = spawn('tasklist');
        tasklist.stdout?.addListener('data', (chunks) => data += chunks?.toString());
        tasklist.addListener('exit', () => {
            if (!data.includes('corgi-keep.exe')) {
                logger.warn('corgi-keep.exe not started, try to restart it.');
                const keep = spawn('corgi-keep.exe', {
                    detached: true,
                    stdio: 'ignore'
                });
                keep.unref();
            }
        });
    }, 500);
}
