import { execSync } from 'child_process';

export default async function detectEnvironment(): Promise<{
    ok: boolean;
    message: string;
}> {
    return new Promise(resolve => {

        // first step: detect ffmpeg

        try {
            execSync('where ffmpeg');
        } catch {
            resolve({
                ok: false,
                message: 'Cannot find missing dependency "FFmpeg" for "Corgi Recorder".'
            });
        }

        resolve({
            ok: true,
            message: ''
        });
    });
}
