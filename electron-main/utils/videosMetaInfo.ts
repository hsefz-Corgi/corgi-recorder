import { app } from 'electron';
import path from 'node:path';
import fs from 'fs/promises';
import { logger } from './configureLog';

export const metaSavePath = path.join(
    app.getPath('appData'),
    'corgi-recorder',
    'videos'
);

export interface videoMeta {
    status: 'recording' | 'exporting' | 'saved';
    savePath: string;
    flvFilePath: string;
    flvDeleted: boolean;
    course: string;
    abstract: string;
    createTime: number;
    duration: number;
};

const meta: videoMeta[] = [];

fs.readFile(metaSavePath).then(data => {
    logger.info('Video meta save path', metaSavePath);
    return JSON.parse(data.toString() ?? '[]');
}).then((data: videoMeta[]) => {
    data.forEach(item => meta.push(item));
}).catch(() => null);

setInterval(() => {
    fs.writeFile(metaSavePath, JSON.stringify(meta, null, 4));
    logger.info('Save video meta', meta.length);
}, 20 * 1000);

export function getAllMetadata() {
    return meta;
}
export function getMeta(id: number) {
    return meta[id];
}
export function addMeta(data: videoMeta) {
    meta.push(data);
    return meta.length - 1;
}

export function getLast(): videoMeta | null {
    return meta[meta.length - 1];
}
