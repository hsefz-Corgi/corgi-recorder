import { app, ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';
import { v4 as uuid } from 'uuid';
import { exec } from 'node:child_process';

import { readConfig, type CorgiConfig } from '../utils/loadConfig';
import { logger } from '../utils/configureLog';
import * as lock from '../utils/lock';

import showError from '../windows/errorWindow';
import requestCourseInfoInput from '../windows/requestCourseInfoInputWindow';

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
            showError(config.software.title, 'FFmpeg failed. Please check logs.');
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
    info.status = 'exporting';
    info.duration = Date.now() - info.createTime;

    exec('taskkill /im ffmpeg.exe /f');
    setTimeout(() => {
        info.savePath = path.join(app.getPath('videos'), `corgi.${uuid()}.mp4`);
        const command = `ffmpeg -i "${info.flvFilePath}" ${config.videos.bitrate ? `-b:v ${config.videos.bitrate}k` : ''} ${config.audios.bitrate ? `-b:a ${config.audios.bitrate}k` : ''} "${info.savePath}"`;
        logger.info('command=', command);

        const courseContentPromise = (config.fileSavePath.includes('%course%') || config.fileSavePath.includes('%abstract%')) ? requestCourseInfoInput(config) : null;

        const exportTask = exec(command);
        exportTask.stderr?.on('data', (data) => {
            logger.info('ffmpeg', data?.toString());
        });
        exportTask.on('exit', async () => {
            lock.release('ffmpeg');
            const courseContent = await courseContentPromise;
            logger.info('course', courseContent);
            const currentTime = new Date();
            const savePath = config.fileSavePath
                .replaceAll('%year%', currentTime.getFullYear().toString())
                .replaceAll('%month%', (currentTime.getMonth() + 1).toString())
                .replaceAll('%date%', currentTime.getDate().toString())
                .replaceAll('%hour%', currentTime.getHours().toString())
                .replaceAll('%minute%', currentTime.getMinutes().toString())
                .replaceAll('%second%', currentTime.getSeconds().toString())
                .replaceAll('%course%', courseContent?.name ?? '')
                .replaceAll('%abstract%', courseContent?.abstract ?? '');

            await fs.mkdir(path.dirname(savePath), {
                recursive: true
            });
            await fs.copyFile(info.savePath, savePath);
            fs.unlink(info.savePath);

            logger.info('Save to', savePath);

            info.savePath = savePath;
            info.status = 'saved';
            exec(`explorer.exe /select, "${info.savePath}"`);
        });
    }, 2000);
}

export function cleanupFlv() {
    const now = Date.now();
    const limit = 1000 * 60 * 60 * 24 * 3; // TODO: PUT IT TO CONFIG
    getAllMetadata().forEach(meta => {
        if (meta.status == 'saved' && !meta.flvDeleted && now - meta.createTime > limit) {
            fs.unlink(meta.flvFilePath).then(() => {
                meta.flvDeleted = true;
            });
        }
    });
}

export function isRecording() {
    return getLast()?.status == 'recording';
}
export function isExporting() {
    return getLast()?.status == 'exporting';
}

export function registerRecorderIpc() {
    ipcMain.handle('record:start', async () => {
        start((await readConfig()).data);
    });
    ipcMain.handle('record:terminate', async () => {
        terminate((await readConfig()).data);
    });
}
