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
        const config = await readConfig();

        if (!config.data.features.forgetToRecordNotification.enabled) return;
        if (info?.status === 'recording') return;

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

        let left = 0, right = currentTimeTable.length - 1;
        while (left <= right) {
            const middle = ~~((left + right) / 2);
            const destination = parseInt(currentTimeTable[middle].split(':')[0]) * 60 + parseInt(currentTimeTable[middle].split(':')[1]);
            if (destination < currentMinute) left = middle + 1;
            else if (destination > currentMinute) right = middle - 1;
            else {
                logger.warn('Forget to record', currentTimeTable[middle], destination);
                showError(config.data.notify.forgetToRecord.message);
                notified = true;
                setTimeout(() => notified = false, 60 * 1000);
                return;
            }
        }
    }, 5000);
}
