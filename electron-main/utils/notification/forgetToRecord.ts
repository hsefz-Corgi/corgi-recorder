import { dialog } from 'electron';
import { readConfig } from '../loadConfig';
import { getLast } from '../videosMetaInfo';
import { logger } from '../configureLog';
import showError from '../../windows/errorWindow';

export default function startForgetToRecordDetector() {
    let notified = false;
    setInterval(async () => {
        if (notified) return;
        const info = getLast();
        if (!info) return;
        const config = await readConfig();
        const currentTimeTable = config.data.notify.forgetToRecord.timetable[
            new Date().getDay() || 7
            /*
             * Sunday: 7
             * Monday: 1
             * Tuesday: 2
             * Wednesday: 3
             * Thursday: 4
             * Friday: 5
             * Saturday: 6
             */
        ];
        const currentDate = new Date();
        const currentMinute = currentDate.getHours() * 60 + currentDate.getMinutes();
        for (let i = 0; i < currentTimeTable.length; i++) {
            // TODO: Use O(log(n)) binary search to instead of O(n) foreach
            const destination = parseInt(currentTimeTable[i].split(':')[0]) * 60 + parseInt(currentTimeTable[i].split(':')[1]);
            if (info.status != 'recording' && currentMinute == destination && config.data.features.forgetToRecordNotification) {
                logger.warn('Forget to record', currentTimeTable[i]);
                showError(config.data.software.title, config.data.notify.forgetToRecord.message);
                notified = true;
                setTimeout(() => notified = false, 60 * 1000);
            }
        }
    }, 5000);
}
