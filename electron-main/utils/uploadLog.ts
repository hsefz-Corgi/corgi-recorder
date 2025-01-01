import { ipcMain } from 'electron';
import fs from 'fs/promises';
import { serverAddressFilePath } from './loadConfig';
import { getLatestLog, logger } from './configureLog';
import showAssets from './showAssets';

export default async function uploadLog(show = false) {
    let serverAddress = 'https://service.recorder.corgi.lihugang.top/';
    try {
        serverAddress = (await fs.readFile(serverAddressFilePath)).toString();
    } catch { }

    const logs = await getLatestLog();

    const logCollectURL = `${serverAddress}log`;

    logger.info(`Upload logs to ${logCollectURL}, size ${logs.length}`);
    const response = await fetch(`${serverAddress}log`, {
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
    if (show) showAssets(`${serverAddress}logs/${data.data}`);
}

export function registerShowLogIpcHandler() {
    ipcMain.handle('logs:upload', (_event, show = false) => {
        uploadLog(show);
    });
}
