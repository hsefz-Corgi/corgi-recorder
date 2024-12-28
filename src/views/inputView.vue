<template>
    <n-space class="select-none p-4" :vertical="true">
        <div>
            课程：<n-select v-model:value="courseType" style="width: 250px; display: inline-block" :options="courseTypeList.map(item => {
                return {
                    label: item,
                    value: item
                }
            })"></n-select>
        </div>
        <div>
            名称：<n-input v-model:value="courseName" style="width: 250px; display:inline-block" show-count :maxlength="80"
                placeholder="" clearable></n-input>
        </div>
        <n-button @click="save" type="primary">保存</n-button>
    </n-space>
</template>
<script lang="ts" setup>
import getBridge from '@/utils/jsbridge';

const bridge = getBridge();

import { ref, reactive } from 'vue';
import { NSpace, NSelect, NInput, NButton } from 'naive-ui';

const courseType = ref('语文');
const courseTypeList = reactive<string[]>([]);
const courseName = ref('');

bridge.config.get().then(config => {
    config.software.courseOptions.forEach(course => courseTypeList.push(course));
});

const save = () => {
    setTimeout(() => {
        bridge.page.input.sendData(courseType.value, courseName.value);
        window.close();
    }, 1000);
}

</script>
<style scoped>
* {
    font-family: 'Noto';
}
</style>
