import { app, dialog } from 'electron';

import detectEnvironment from './utils/detectEnvironment';
import { registerLockIpc } from './utils/lock';
import { applyConfig, readConfig, registerConfigIpc } from './utils/loadConfig';
import isFirstRun from './utils/isFirstRun';

import startConfigWindow, { registerConfigWindowIpc } from './windows/configWindow';
import startSetupWindow from './windows/setupWindow';
import startMainWindow from './windows/mainWindow';
import { registerErrorBoxIpc } from './windows/errorWindow';

import { registerVideoTestIpcHandler } from './record/test/video';
import { registerAudioTestIpcHandler } from './record/test/audio';
import { registerAudioInfoFetcherIpcHandler } from './record/getAudioInfo';

import { cleanupFlv, registerRecorderIpc } from './record/record';

import startForgetToTerminateDetector from './utils/notification/forgetToTerminate';
import startForgetToRecordDetector from './utils/notification/forgetToRecord';

if (!app.requestSingleInstanceLock()) app.quit();

import { logger } from './utils/configureLog';

Promise.all([
    app.whenReady(),
    detectEnvironment(),
    readConfig()
]).then(async result => {
    logger.info('App ready');

    const environmentDetectResult = result[1];
    if (!environmentDetectResult.ok) {
        logger.error('Failed to start app: Unresolved dependencies', environmentDetectResult.message);
        dialog.showErrorBox('Unresolved dependencies', environmentDetectResult.message);
        return app.quit();
    }

    const config = result[2];
    if (!config.ok) {
        logger.error('Failed to start app: failed to read config', config.error);
        dialog.showErrorBox('Corgi 录屏', config.error);
        return app.quit();
    }
    applyConfig(config.data);
    logger.info('Config applied.');

    cleanupFlv();
    logger.info('Garbage collected.');

    app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
    // auto-play error music

    registerConfigIpc();
    registerLockIpc();

    registerConfigWindowIpc();
    registerErrorBoxIpc();
    registerRecorderIpc();

    registerVideoTestIpcHandler();
    registerAudioTestIpcHandler();
    registerAudioInfoFetcherIpcHandler();
    logger.info('IPC registered.');

    startForgetToTerminateDetector();
    startForgetToRecordDetector();
    logger.info('Task registered.');

    if (await isFirstRun()) {
        await startSetupWindow();
        console.log('corgi');
        await startConfigWindow(config.data);
    }

    await startMainWindow(config.data);
});
