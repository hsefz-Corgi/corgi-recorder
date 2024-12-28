<template>
    <div class="p-2 select-none">
        <template v-if="!recording">
            <n-button @click="record" type="primary" :disabled="isFFmpegLocked"
                :title="isFFmpegLocked ? '多测不加锁，柯基两行泪' : ''">录制</n-button>
        </template>
        <template v-else>
            <n-button @click="terminate" type="error">结束</n-button>
        </template>
        &nbsp;&nbsp;
        <n-button @click="openConfigPage" type="info">设置</n-button>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { NButton } from 'naive-ui';
import getBridge from '@/utils/jsbridge';

const bridge = getBridge();

const recording = ref(false);
const isFFmpegLocked = ref(false);

function record() {
    recording.value = true;
    bridge.record.start();
}
async function terminate() {
    const config = await bridge.config.get();
    if (config.features.terminateRecordNotification)
        if (!confirm("你确定要结束录屏吗？")) return;
    recording.value = false;
    bridge.record.terminate();
}
function openConfigPage() {
    bridge.page.config.open();
}

setInterval(() => {
    bridge.lock.detect('ffmpeg').then(status => {
        isFFmpegLocked.value = status;
    });
}, 1000);

</script>
<style scoped>
* {
    font-family: 'Noto';
}
</style>
