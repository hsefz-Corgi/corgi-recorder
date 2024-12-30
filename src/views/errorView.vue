<template>
    <div class="bg-white border-gray-400 border-b-gray-300 border p-1 select-none pb-2 pl-2 pr-1">
        <div class="title">
            <div class=" text-sm text-gray-400 font-thin">{{ appName }}</div>
            <div style="position: fixed; right: 0px; top: 0px; padding-left: 4px; padding-right: 4px"
                class="close hover:bg-red-600 cursor-pointer" @click="close">
                <span class="pr-1.5 pl-1.5 text-xl">×</span>
            </div>
        </div>
        <div>
            <div class="bg-white pl-2 pr-2 pt-3 pb-3">
                <div class="pl-4 pr-4 pt-4 text-base">{{ content }}</div>
            </div>

        </div>
    </div>
    <div class=" bg-gray-100 border-gray-400 border-l border-r border-b pl-2 pr-2 pt-2 pb-2 text-right ">
        <button @click="close"
            class=" select-none border-gray-400 bg-gray-250 hover:bg-gray-300 border pl-4 pr-4 text-sm" autofocus
            @keydown.enter="close" ref="confirmButton">确定</button>
    </div>

    <audio src="assets/sounds/error.mp3" class="hidden" ref="error"></audio>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import getBridge from '@/utils/jsbridge';

const appName = ref('');
const title = ref('');
const content = ref('');
const error = ref<HTMLAudioElement>();
const confirmButton = ref<HTMLButtonElement>();
const id = ref(0);
const bridge = getBridge();

bridge.config.get().then(config => {
    appName.value = config.software.title;
});

const close = () => bridge.page.error.close(id.value);
(window as any).showError = (_title: string, _content: string, _id: number) => {
    title.value = _title;
    content.value = _content;
    id.value = _id;
    error.value?.play();
    if (confirmButton.value) {
        confirmButton.value.focus();
    }
};

</script>
<style scoped>
* {
    font-family: 'Consolas', 'Noto';
}

.title {
    -webkit-app-region: drag;
}

.close {
    -webkit-app-region: no-drag;
}
</style>
