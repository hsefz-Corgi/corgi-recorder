console.log('Corgi Preload');

import { contextBridge, ipcRenderer } from 'electron';
contextBridge.exposeInMainWorld('corgi', {
    config: {
        get: () => ipcRenderer.invoke('config:get'),
        set: (config: unknown) => ipcRenderer.invoke('config:set', config)
    },
    record: {
        test: {
            video: (fps: number, bitrate: number, resolution: string) => ipcRenderer.invoke('record:test:video', fps, bitrate, resolution),
            audio: (microphone: string, computer: string, bitrate: number) => ipcRenderer.invoke('record:test:audio', microphone, computer, bitrate)
        },
        audio: {
            info: () => ipcRenderer.invoke('record:audio:info:fetcher')
        },
        start: () => ipcRenderer.invoke('record:start'),
        terminate: () => ipcRenderer.invoke('record:terminate')
    },
    lock: {
        get: (id: string, wait: boolean) => ipcRenderer.invoke('lock:get', id, wait),
        release: (id: string) => ipcRenderer.invoke('lock:release', id),
        detect: (id: string) => ipcRenderer.invoke('lock:detect', id)
    },
    page: {
        config: {
            open: () => ipcRenderer.invoke('page:open:config')
        },
        error: {
            close: (id: string) => ipcRenderer.invoke('page:error:close', id)
        },
        input: {
            sendData: (type: string, abstract: string) => ipcRenderer.invoke('page:input:sendData', type, abstract)
        }
    }
});
