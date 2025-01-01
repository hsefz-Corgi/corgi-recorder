import { app, ipcMain } from 'electron';
import path from 'node:path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import { exec } from 'child_process';

import { logger } from '../../utils/configureLog';

import * as lock from '../../utils/lock';
import showAssets from '../../utils/showAssets';

export function registerAudioTestIpcHandler() {
    ipcMain.handle('record:test:audio', (e, microphone: string, computer: string, bitrate: number) => testAudioRecording(microphone, computer, bitrate));
}

export default function testAudioRecording(microphone: string, computer: string, bitrate: number) {
    const flvPath = path.join(app.getPath('temp'), uuidv4() + '.flv');
    const mp3Path = path.join(app.getPath('temp'), uuidv4() + '.mp3');

    logger.info('Test audio recording, microphone=', microphone, 'computer=', computer, 'bitrate=', bitrate);
    logger.info('flvPath=', flvPath, ' mp3Path=', mp3Path);

    const command = `ffmpeg -f gdigrab -i desktop -f dshow -i audio="${microphone}" -f dshow -i audio="${computer}" -filter_complex amix=inputs=2:duration=first:dropout_transition=2 "${flvPath}"`;
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
                const command = `ffmpeg -i "${flvPath}" ${bitrate ? `-b:a ${bitrate}k` : ''
                    } "${mp3Path}"`;
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
                        showAssets(mp3Path);
                    }, 200);
                });
            }, 2000);
        }, 15000);
    });
}
