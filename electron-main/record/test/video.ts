import { app, ipcMain } from 'electron';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { exec } from 'child_process';

import { logger } from '../../utils/configureLog';

import * as lock from '../../utils/lock';
import showAssets from '../../utils/showAssets';

export function registerVideoTestIpcHandler() {
    ipcMain.handle('record:test:video', (e, fps: number, bitrate: number, resolution: string) => testVideoRecording(fps, bitrate, resolution));
}

export default function testVideoRecording(fps: number, bitrate: number, resolution: string) {
    const flvPath = path.join(app.getPath('temp'), uuidv4() + '.flv');
    const mp4Path = path.join(app.getPath('temp'), uuidv4() + '.mp4');

    logger.info('Test video recording, fps=', fps, ' bitrate=', bitrate, ' kbps, resolution=', resolution);
    logger.info('flvPath=', flvPath, ' mp4Path=', mp4Path);

    const command = `ffmpeg -f gdigrab -i desktop ${fps ? `-r ${fps}` : ''
        } -vf scale=${resolution.split('x')[0]}:${resolution.split('x')[1]} "${flvPath}"`;
    logger.info('command=', command);

    return new Promise<void>(async resolve => {
        await lock.waitForLock('ffmpeg');
        const recordProcess = exec(command);
        recordProcess.stderr?.on('data', (data) => {
            logger.info('ffmpeg', data?.toString());
        });
        setTimeout(() => {
            exec('taskkill /im ffmpeg.exe /f');
            setTimeout(() => {
                const command = `ffmpeg -i "${flvPath}" ${bitrate ? `-b:v ${bitrate}k` : ''
                    } "${mp4Path}"`;
                logger.info('command=', command);
                const exportTask = exec(command);
                exportTask.stderr?.on('data', (data) => {
                    logger.info('ffmpeg', data?.toString());
                });
                exportTask.on('exit', () => {
                    lock.release('ffmpeg');
                    fs.unlink(flvPath);
                    resolve();
                    setTimeout(() => {
                        showAssets(mp4Path);
                    }, 200);
                });
            }, 2000);
        }, 10000);
    });
}
