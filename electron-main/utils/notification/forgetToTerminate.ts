import { dialog } from 'electron';
import { readConfig } from '../loadConfig';
import { getLast } from '../videosMetaInfo';
import { logger } from '../configureLog';

export default function startForgetToTerminateDetector() {
    let notified = false;
    setInterval(async () => {
        const info = getLast();
        const config = await readConfig();
        if (!notified) {
            if (Date.now() - info.createTime >= config.data.notify.forgetToTerminate && info.status == 'recording') {
                logger.info('Record time', Date.now() - info.createTime);
                notified = true;
                dialog.showMessageBox({
                    title: config.data.software.title,
                    message: `录课时间已超过 ${~~((Date.now() - info.createTime) / 1000 / 60)} 分钟`
                });
            }
        } else {
            if (Date.now() - info.createTime < config.data.notify.forgetToTerminate)
                notified = false;
        }
    }, 15000);
}
