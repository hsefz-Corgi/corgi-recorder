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
export interface Bridge {
    config: {
        get: () => Promise<CorgiConfig>,
        set: (config: CorgiConfig) => void
    },
    lock: {
        get: (id: string, wait: boolean) => Promise<void>,
        release: (id: string) => Promise<void>,
        detect: (id: string) => Promise<boolean>
    },
    record: {
        test: {
            video: (fps: number, bitrate: number, resolution: string) => Promise<void>,
            audio: (microphone: string, computer: string, bitrate: number) => Promise<void>
        },
        audio: {
            info: () => Promise<{
                name: string;
                deviceId: string;
            }[]>
        },
        start: () => Promise<void>,
        terminate: () => Promise<void>
    },
    page: {
        config: {
            open: () => Promise<void>,
            exportLog: () => Promise<void>
        },
        error: {
            close: (id: number) => Promise<void>;
        },
        input: {
            sendData: (courseName: string, courseAbstract: string) => Promise<void>;
        }
    }
};
export default function getBridge(): Bridge {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (window as any).corgi;
}
