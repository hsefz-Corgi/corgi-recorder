import { ipcMain } from 'electron';

const lock: Set<string> = new Set();

export function detect(id: string) {
    return lock.has(id);
}

export function request(id: string) {
    if (detect(id)) return false;
    lock.add(id);
    return true;
}

export function release(id: string) {
    lock.delete(id);
}

export function sleep(time: number) {
    return new Promise<void>(resolve => {
        setTimeout(resolve, time);
    });
}

export async function waitForLock(id: string, interval: number = 100) {
    while (!request(id)) await sleep(interval);
}

export function registerLockIpc() {
    ipcMain.handle('lock:get', (_e, id: string, wait: boolean) => {
        return wait ? request(id) : waitForLock(id);
    });
    ipcMain.handle('lock:release', (_e, id: string) => {
        return release(id);
    });
    ipcMain.handle('lock:detect', (_e, id: string) => {
        return detect(id);
    });
}
