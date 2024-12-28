import { app } from 'electron';
import fs from 'fs/promises';
import path from 'node:path';

export default async function isFirstRun() {
    const filePath = path.join(app.getPath('appData'), 'corgi-recorder', 'corgi');
    try {
        await fs.access(filePath);
        return false;
    } catch {
        fs.writeFile(filePath, 'corgi');
    }
    return true;
}
