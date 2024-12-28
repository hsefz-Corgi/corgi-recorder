import { app, ipcMain } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';

import rejectToExit from './rejectToExit';

export interface CorgiConfig {
    fileSavePath: string;
    audios: {
        microphone: string;
        computer: string;
        bitrate: number; // unit: k
    };
    videos: {
        fps: number;
        bitrate: number; // unit: k
        resolution: string;
    },
    notify: {
        forgetToRecord: {
            timetable: Array<Array<string>>; // 1 -> Monday, 2 -> Tuesday, etc.
            message: string;
        };
        forgetToTerminate: number; // unit: millisecond
    };
    features: Record<'alwaysOnTop' | 'launchWhenSetup' | 'allowToExit' | 'terminateRecordNotification' | 'denyQuittingWhenRecording' | 'denyQuittingWhenExporting' | 'forgetToRecordNotification' | 'forgetToTerminateNotification', {
        enabled: boolean;
        locked: boolean;
    }>;
    software: {
        title: string;
        courseOptions: string[];
    }
};

export const configFilePath = path.join(app.getPath('appData'), 'corgi-recorder', 'config');
export const serverAddressFilePath = path.join(app.getPath('appData'), 'corgi-recorder', 'server');
export const sequenceIdFilePath = path.join(app.getPath('appData'), 'corgi-recorder', 'seq');
let config: CorgiConfig | null = null;

export async function readConfig(): Promise<{
    ok: boolean;
    data: CorgiConfig;
    error: string;
}> {
    if (config) return {
        ok: true,
        data: config,
        error: ''
    };
    let data: CorgiConfig;
    try {
        data = JSON.parse((await fs.readFile(configFilePath)).toString());
        config = data;
        return {
            ok: true,
            data: data,
            error: ''
        }
    } catch {
        let serverAddress: string = 'https://service.recorder.corgi.lihugang.top/';
        let sequenceId: string = 'default';
        try {
            serverAddress = (await fs.readFile(serverAddressFilePath)).toString();
        } catch { }
        try {
            sequenceId = (await fs.readFile(sequenceIdFilePath)).toString();
        } catch { }

        const defaultConfigDownloadURL = `${serverAddress}config/default/${sequenceId}`;
        try {
            data = await (await fetch(defaultConfigDownloadURL)).json();
            await saveConfig(data);
            applyConfig(data);
            config = data;
            return {
                ok: true,
                data: data,
                error: ''
            }
        } catch (err) {
            return {
                ok: false,
                data: null as any,
                error: `无法从 ${defaultConfigDownloadURL} 下载默认配置文件。\n` + err?.message
            }
        }
    }
}

export async function saveConfig(newConfig: CorgiConfig) {
    await fs.writeFile(configFilePath, JSON.stringify(newConfig));
    config = newConfig;
}

export async function applyConfig(config: CorgiConfig) {
    app.setLoginItemSettings({
        openAtLogin: config.features.launchWhenSetup.enabled
    });
    if (!config.features.allowToExit.enabled) rejectToExit(config);
}

export function registerConfigIpc() {
    ipcMain.handle('config:get', (_e) => {
        return config;
    });
    ipcMain.handle('config:set', (_e, newConfig: CorgiConfig) => {
        saveConfig(newConfig);
        applyConfig(newConfig);
    });
}
