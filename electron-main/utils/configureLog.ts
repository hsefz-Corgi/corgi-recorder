import { app } from 'electron';
import * as log4js from 'log4js';
import path from 'node:path';
import fs from 'fs/promises';

const logFileDirectory = path.join(app.getPath('appData'), 'corgi-recorder', 'logs');
fs.mkdir(logFileDirectory, {
    recursive: true
});
log4js.configure({
    appenders: {
        console: {
            type: 'console'
        },
        file: {
            type: 'file',
            filename: path.join(logFileDirectory, `${new Date().toISOString().replaceAll(':', '.')}.log`)
        }
    },
    categories: {
        default: {
            appenders: ['console', 'file'],
            level: app.isPackaged ? 'info' : 'debug'
        }
    }
});

export const logger = log4js.getLogger();
