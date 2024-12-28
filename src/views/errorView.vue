<template>
    <div class="bg-gradient-to-r from-zinc-200 to-sky-200 rounded-md p-1 select-none pb-2 pl-2 pr-1 border-gray-600"
        style="border-width: 1px">
        <div class="title">
            <div>{{ appName }}</div>
            <div style="position: fixed; right: 15px; top: 1px; padding-left: 4px; padding-right: 4px"
                class="bg-red-600 close" @click="close">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
                    width="20px">
                    <path
                        d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41z"
                        fill="white"></path>
                </svg>
            </div>
        </div>
        <div class="border-gray-600" style="border-width: 1px">
            <div class="bg-white pl-2 pr-2 pt-3 pb-3">
                <table class="border-spacing-0">
                    <tbody>
                        <tr>
                            <td>
                                <img src="/assets/images/corgi.jpg" class="w-12">
                            </td>
                            <td>
                                <div class="pl-4 pr-4 text-xl text-blue-500">{{ title }}</div>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <div class="pl-4 pr-4 pt-4">{{ content }}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="bg-gray-200 pl-2 pr-2 pt-2 pb-2 text-right ">
                <button @click="close" class="border-cyan-400 border-2 pt-1 pb-1 pl-3 pr-3 rounded-md">确定</button>
            </div>

        </div>
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
