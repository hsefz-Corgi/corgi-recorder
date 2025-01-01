<template>
    <n-space class="p-4 select-none" :vertical="true">
        <div class="text-center w-full text-2xl">{{ config.software.title }} - 设置
        </div>
        <hr />
        <div class="text-xl">文件</div>
        <n-space class="p-2" :vertical="true">
            文件保存路径：<n-input clearable show-count maxlength="180" placeholder="D:/corgi-recorder/"
                v-model:value="config.fileSavePath" />

            支持使用占位符
            %year%（年）、%month%（月）、%date%（日）、%hour%（小时）、%minute%（分钟）、%second%（秒）、%course%（课程名称）、%abstract%（课程内容摘要）。
        </n-space>
        <hr />
        <div class="text-xl">视频</div>
        <n-space class="p-2" :vertical="true">
            <div>
                帧率：<n-input-number :min="0" :max="60" v-model:value="config.videos.fps" clearable
                    style="width: 200px; display: inline-block" /> <br />
                值为 0 时自动选择
            </div>
            <div>
                比特率：<n-input-number :min="0" :max="4096" v-model:value="config.videos.bitrate" clearable
                    style="width: 200px; display: inline-block" /> <br />
                单位为 kbps，值为 0 时自动选择
            </div>
            <div>
                分辨率：<n-input v-model:value="config.videos.resolution" maxlength="12" show-count clearable
                    style="width: 240px; display: inline-block" />
            </div>
        </n-space>
        <n-button @click="testVideo" type="info" dashed :loading="isTestingVideo"
            :disabled="!isTestingVideo && isFFmpegLocked"
            :title="(!isTestingVideo && isFFmpegLocked) ? '多测不加锁，柯基两行泪' : ''">测试</n-button>
        <hr />
        <div class="text-xl">音频</div>
        <n-space class="p-2" :vertical="true">
            <div>
                麦克风设备：<n-select v-model:value="config.audios.microphone" :options="audioInfo.map(item => {
                    return {
                        label: item.name,
                        value: item.deviceId
                    }
                })" style="width: 400px; display: inline-block" />
            </div>
            <div>
                系统音频输入：<n-select v-model:value="config.audios.computer" :options="audioInfo.map(item => {
                    return {
                        label: item.name,
                        value: item.deviceId
                    }
                })" style="width: 400px; display: inline-block" /> <br />
                找不到设备？请尝试通过“设置->声音->声音控制面板->录制->立体声混音->启用”以启用声卡并将系统音频输入设为“立体声混音”。或者可以下载并安装软件 Screen Capture Recorder
                后将系统音频输入设为“virtual-audio-capturer”。
            </div>
            <div>
                比特率：<n-input-number :min="0" :max="4096" v-model:value="config.audios.bitrate" clearable
                    style="width: 200px; display: inline-block" /> <br />
                单位为 kbps，值为 0 时自动选择
            </div>
        </n-space>
        <div>
            <n-button @click="refreshAudioInfo" type="success" dashed>刷新音频设备信息</n-button> &nbsp;
            <n-button @click="testAudio" type="info" dashed :loading="isTestingAudio"
                :disabled="!isTestingAudio && isFFmpegLocked"
                :title="(!isTestingAudio && isFFmpegLocked) ? '多测不加锁，柯基两行泪' : ''">测试</n-button>
        </div>
        <hr />
        <div class="text-xl">课程</div>
        <n-space class="p-2" :vertical="true">
            课程选项：
            <n-dynamic-tags v-model:value="config.software.courseOptions" :min="1" :max="99" placeholder="语文" />
        </n-space>
        <hr />
        <div class="text-xl">功能选项</div>
        <n-space class="p-2" :vertical="true">
            <table class="border-0">
                <tbody>
                    <tr>
                        <td>置顶</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.alwaysOnTop.enabled"
                                :disabled="config.features.alwaysOnTop.locked" />
                        </td>
                        <td>&emsp; &emsp;</td>
                        <td>开机自动启动</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.launchWhenSetup.enabled"
                                :disabled="config.features.launchWhenSetup.locked" />
                        </td>
                        <td>&emsp; &emsp;</td>
                        <td>结束录屏二次确认</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.terminateRecordNotification.enabled"
                                :disabled="config.features.terminateRecordNotification.locked" />
                        </td>
                    </tr>
                    <tr>
                        <td>录屏时禁止退出</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.denyQuittingWhenRecording.enabled"
                                :disabled="config.features.denyQuittingWhenRecording.locked" />
                        </td>
                        <td>&emsp; &emsp;</td>
                        <td>导出视频时禁止退出</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.denyQuittingWhenExporting.enabled"
                                :disabled="config.features.denyQuittingWhenExporting.locked" />
                        </td>
                    </tr>
                    <tr>
                        <td>忘记录屏提醒</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.forgetToRecordNotification.enabled"
                                :disabled="config.features.forgetToRecordNotification.locked" />
                        </td>
                        <td>&emsp; &emsp;</td>
                        <td>忘记结束录屏提醒</td>
                        <td>&nbsp;</td>
                        <td>
                            <n-switch v-model:value="config.features.forgetToTerminateNotification.enabled"
                                :disabled="config.features.forgetToTerminateNotification.locked" />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div v-show="config.features.forgetToRecordNotification.enabled">
                <div class="text-xl">忘记录屏提醒</div>
                提醒消息：<n-input v-model:value="config.notify.forgetToRecord.message" maxlength="40" show-count clearable
                    style="width: 280px; display: inline-block;" />
                <br />
                提醒时间：
                <div class="p-2">
                    周一：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[1]" /> <br />
                    周二：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[2]" /> <br />
                    周三：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[3]" /> <br />
                    周四：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[4]" /> <br />
                    周五：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[5]" /> <br />
                    周六：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[6]" /> <br />
                    周日：<n-dynamic-tags v-model:value="config.notify.forgetToRecord.timetable[7]" /> <br />
                </div>
                时间格式："hh:mm"，如 "08:00"、"13:35" 等
            </div>
            <div v-show="config.features.forgetToTerminateNotification.enabled">
                <div class="text-xl">忘记结束录课提醒</div>
                录制超过 <n-input-number v-model:value="config.notify.forgetToTerminate" :min="1000"
                    :max="0x3f3f3f3f * 1000" style="display: inline-block; width: 140px;" />毫秒（{{
                        (config.notify.forgetToTerminate / 60 / 1000).toFixed(1) }} 分钟）后弹窗提醒
            </div>
        </n-space>
        <hr />
        <n-button @click="saveConfig" type="primary" :loading="saving">保存</n-button>
        &nbsp; &nbsp; 部分更改可能需要在重启后才能应用
    </n-space>
</template>
<script lang="ts" setup>
import type { CorgiConfig } from '@/utils/jsbridge';
import getBridge from '@/utils/jsbridge';

import { NSpace, NInput, NInputNumber, NButton, NSelect, NSwitch, NDynamicTags } from 'naive-ui';
import { reactive, ref } from 'vue';

const bridge = getBridge();

const config = reactive<CorgiConfig>({
    fileSavePath: '',
    audios: {
        microphone: '',
        computer: '',
        bitrate: -1
    },
    videos: {
        fps: -1,
        bitrate: -1,
        resolution: ''
    },
    notify: {
        forgetToRecord: {
            timetable: [],
            message: ''
        },
        forgetToTerminate: -1,
    },
    features: {
        allowToExit: { enabled: false, locked: false },
        alwaysOnTop: { enabled: false, locked: false },
        denyQuittingWhenExporting: { enabled: false, locked: false },
        denyQuittingWhenRecording: { enabled: false, locked: false },
        forgetToRecordNotification: { enabled: false, locked: false },
        forgetToTerminateNotification: { enabled: false, locked: false },
        launchWhenSetup: { enabled: false, locked: false },
        terminateRecordNotification: { enabled: false, locked: false }
    },
    software: {
        title: '',
        courseOptions: []
    }
});
bridge.config.get().then(conf => {
    config.audios = conf.audios;
    config.videos = conf.videos;
    config.features = conf.features;
    config.fileSavePath = conf.fileSavePath;
    config.notify = conf.notify;
    config.software = conf.software;
    document.title = config.software.title;
});

const testVideo = () => {
    isTestingVideo.value = true;
    bridge.record.test.video(config.videos.fps, config.videos.bitrate, config.videos.resolution).then(() => {
        isTestingVideo.value = false;
    });
}
const testAudio = () => {
    isTestingAudio.value = true;
    bridge.record.test.audio(config.audios.microphone, config.audios.computer, config.audios.bitrate).then(() => {
        isTestingAudio.value = false;
    });
}
const isTestingVideo = ref(false);
const isTestingAudio = ref(false);

const audioInfo = reactive<{
    name: string;
    deviceId: string;
}[]>([]);
const refreshAudioInfo = () => {
    bridge.record.audio.info().then(info => {
        audioInfo.length = 0;
        for (let i = 0; i < info.length; i++) audioInfo.push(info[i]);
    });
}
refreshAudioInfo();

const saving = ref(false);
const saveConfig = () => {
    saving.value = true;

    for (let i = 0; i < config.notify.forgetToRecord.timetable.length; i++) {
        config.notify.forgetToRecord.timetable[i] = config.notify.forgetToRecord.timetable[i].sort((a, b) => {
            return (parseInt(a.split(':')[0], 10) * 60 + parseInt(a.split(':')[1], 10)) - (parseInt(b.split(':')[0], 10) * 60 + parseInt(b.split(':')[1], 10));
            // a, b format: hh:mm time string
            // keep timetable in order so as to realize O(log n) binary search
        });
    }

    bridge.config.set(JSON.parse(JSON.stringify(config)));
    setTimeout(() => window.close(), 2500);
}

const isFFmpegLocked = ref(false);
setInterval(() => {
    bridge.lock.detect('ffmpeg').then(status => {
        isFFmpegLocked.value = status;
    });
}, 500);
</script>
<style scoped>
* {
    font-family: 'Noto';
}
</style>
