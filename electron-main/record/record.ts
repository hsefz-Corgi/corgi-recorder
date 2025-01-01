import { app, ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { exec } from 'node:child_process';

import { readConfig, type CorgiConfig } from '../utils/loadConfig';
import { logger } from '../utils/configureLog';
import * as lock from '../utils/lock';

import showError from '../windows/errorWindow';
import uploadLog from '../utils/uploadLog';
import requestCourseInfoInput from '../windows/requestCourseInfoInputWindow';
import showProgressWindow from '../windows/progressWindow';

import { addMeta, getAllMetadata, getLast } from '../utils/videosMetaInfo';

export async function start(config: CorgiConfig) {
    await lock.waitForLock('ffmpeg');
    const flvPath = path.join(app.getPath('videos'), `corgi.${uuid()}.flv`);
    const command = `ffmpeg -f gdigrab -i desktop -f dshow -i audio="${config.audios.microphone}" -f dshow -i audio="${config.audios.computer}" -filter_complex amix=inputs=2:duration=first:dropout_transition=2 "${flvPath}"`;

    logger.info('command= ', command);

    const recordProcess = exec(command);
    recordProcess.stderr?.on('data', (data) => logger.info('ffmpeg', data?.toString()));
    recordProcess.on('close', () => {
        if (isRecording()) {
            showError('FFmpeg failed. Please check logs.');
            uploadLog(true);
        }
    });

    logger.info('Record started');

    addMeta({
        status: 'recording',
        savePath: '',
        flvFilePath: flvPath,
        flvDeleted: false,
        createTime: Date.now(),
        course: 'corgi',
        abstract: 'corgi',
        duration: -1,
    });
}
export function terminate(config: CorgiConfig) {
    logger.info('Record terminated.');

    const info = getLast();
    if (!info) return logger.error('Error: fail to get the last video meta.');
    info.status = 'exporting';
    info.duration = Date.now() - info.createTime;

    exec('taskkill /im ffmpeg.exe /f');
    setTimeout(() => {
        info.savePath = path.join(app.getPath('videos'), `corgi.${uuid()}.mp4`);
        const command = `ffmpeg -i "${info.flvFilePath}" ${config.videos.bitrate ? `-b:v ${config.videos.bitrate}k` : ''} ${config.audios.bitrate ? `-b:a ${config.audios.bitrate}k` : ''} "${info.savePath}"`;
        logger.info('command=', command);

        const courseContentPromise = (config.fileSavePath.includes('%course%') || config.fileSavePath.includes('%abstract%')) ? requestCourseInfoInput(config) : null;

        const progress = showProgressWindow(config);

        const exportTask = exec(command);
        exportTask.stderr?.on('data', (data) => {
            logger.info('ffmpeg', data?.toString());
            data.toString().split('\n').forEach((msg: string) => {
                if (msg.includes('time=')) {
                    const progressArray = msg
                        .substring(msg.indexOf('time='))
                        .split(' ')[0]
                        .split('=')[1]
                        .split('.')[0]
                        .split(':')
                        .map(item => parseInt(item, 10));
                    /*
                     * example
                     * ffmpeg frame=  273 fps= 60 q=-1.0 Lsize=     994kB time=00:00:09.09 bitrate= 895.5kbits/s dup=248 drop=0 speed=1.98x
                    * video:839kB audio:144kB subtitle:0kB other streams:0kB global headers:0kB muxing overhead: 1.174847%
                     */
                    const currentConverted = progressArray[0] * 3600 + progressArray[1] * 60 + progressArray[2];
                    const currentProgress = Math.round(currentConverted / (info.duration / 1000 /* ms -> s */) * 1000) / 10; // currentProgress: percentage
                    progress.updateProgress(currentProgress);
                    logger.info('progress = ', currentProgress);
                }
            });
        });
        exportTask.on('exit', async () => {
            progress.close();
            lock.release('ffmpeg');
            const courseContent = await courseContentPromise;
            logger.info('course', courseContent);
            const currentTime = new Date();
            const savePath = path.normalize(config.fileSavePath
                .replaceAll('%year%', currentTime.getFullYear().toString())
                .replaceAll('%month%', (currentTime.getMonth() + 1).toString())
                .replaceAll('%date%', currentTime.getDate().toString())
                .replaceAll('%hour%', currentTime.getHours().toString())
                .replaceAll('%minute%', currentTime.getMinutes().toString())
                .replaceAll('%second%', currentTime.getSeconds().toString())
                .replaceAll('%course%', courseContent?.name ?? '')
                .replaceAll('%abstract%', courseContent?.abstract ?? ''));

            await fs.mkdir(path.dirname(savePath), {
                recursive: true
            });
            await fs.copyFile(info.savePath, savePath);
            fs.unlink(info.savePath);

            logger.info('Save to', savePath);

            info.savePath = savePath;
            info.status = 'saved';
            exec(`explorer.exe /select,"${info.savePath}"`);
        });
    }, 2000);
}

export function cleanupFlv() {
    const now = Date.now();
    const limit = 1000 * 60 * 60 * 24 * 3; // TODO: PUT IT TO CONFIG
    getAllMetadata().forEach(meta => {
        if (meta.status === 'saved' && !meta.flvDeleted && now - meta.createTime > limit) {
            fs.unlink(meta.flvFilePath).then(() => {
                meta.flvDeleted = true;
            });
        }
    });
}

export function isRecording() {
    return getLast()?.status === 'recording';
}
export function isExporting() {
    return getLast()?.status === 'exporting';
}

export function registerRecorderIpcHandler() {
    ipcMain.handle('record:start', async () => {
        start((await readConfig()).data);
    });
    ipcMain.handle('record:terminate', async () => {
        terminate((await readConfig()).data);
    });
}
