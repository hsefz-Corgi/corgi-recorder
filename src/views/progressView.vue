<template>
    <n-space class="p-4 select-none" :vertical="true">
        正在导出文件... (已完成 {{ currentProgress }}%)
        <n-progress type="line" :percentage="currentProgress" indicator-placement="inside" processing /> </n-space>
</template>
<script lang="ts" setup>
import { NSpace, NProgress } from 'naive-ui';
import { ref } from 'vue';
const currentProgress = ref(0);

setInterval(() => {
    currentProgress.value = (window as any).cp ?? 0;
}, 400);
</script>
<style scoped>
* {
    font-family: 'Noto';
}
</style>
