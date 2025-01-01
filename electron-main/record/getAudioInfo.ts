import { exec } from 'child_process';
import { ipcMain } from 'electron';

import { logger } from '../utils/configureLog';

export default async function getAudioInfo() {
    return new Promise<{
        name: string;
        deviceId: string;
    }[]>(resolve => {
        const ffmpeg = exec('ffmpeg -list_devices true -f dshow -i dummy');
        let data = '';
        ffmpeg.stderr?.on('data', chunks => {
            data += chunks?.toString();
        });
        ffmpeg.on('exit', () => {
            logger.info('Device Info: ', data);
            const result: {
                name: string;
                deviceId: string;
            }[] = [];
            data.split('\n').forEach(line => {
                if (line.startsWith('[dshow')) {
                    if (line.includes('Alternative name')) result[result.length - 1].deviceId = line.substring(line.indexOf('"') + 1).slice(0, -2);
                    else
                        result.push({
                            name: line.substring(line.indexOf('"') + 1).slice(0, -2),
                            deviceId: 'null'
                        })
                }
            });
            resolve(result.filter(item => item.deviceId !== 'null'));
        });
    });
}

export function registerAudioInfoFetcherIpcHandler() {
    ipcMain.handle('record:audio:info:fetcher', () => getAudioInfo());
}
