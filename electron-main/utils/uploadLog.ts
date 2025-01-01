import { ipcMain } from 'electron';
import fs from 'fs/promises';
import { serverAddressFilePath } from './loadConfig';
import { getLatestLog, logger } from './configureLog';
import showAssets from './showAssets';
import showError from '../windows/errorWindow';

export default async function uploadLog(show = false) {
    let serverAddress = 'https://service.recorder.corgi.lihugang.top/';
    try {
        serverAddress = (await fs.readFile(serverAddressFilePath)).toString();
    } catch { }

    const logs = await getLatestLog();

    const logCollectURL = `${serverAddress}log`;

    logger.info(`Upload logs to ${logCollectURL}, size ${logs.length}`);

    try {
        const response = await fetch(logCollectURL, {
            method: 'POST',
            headers: {
                'content-type': 'text/plain; charset=utf-8'
            },
            body: logs
        });
        const data: {
            ok: boolean;
            data: string;
        } = await response.json();
        const logShowURL = `${serverAddress}logs/${data.data}`;
        logger.info('Logs were uploaded to', logShowURL);
        if (show) showAssets(logShowURL);
    } catch (err) {
        logger.error('Failed to upload logs.');
        logger.error(err);
        showError(`日志导出失败，无法连接至服务器`);
    }
}

export function registerShowLogIpcHandler() {
    ipcMain.handle('logs:upload', (_event, show = false) => {
        return uploadLog(show);
    });
}
