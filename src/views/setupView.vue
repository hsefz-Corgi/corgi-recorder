<template>
    <div class="title" :style="{
        display: show ? 'block' : 'none'
    }">Corgi</div>
    <div class="notes" :style="{
        display: show ? 'block' : 'none'
    }">{{ title }}</div>
</template>
<script lang="ts" setup>
import getBridge from '@/utils/jsbridge';
import { ref } from 'vue';

const bridge = getBridge();

const title = ref('');
bridge.config.get().then(config => {
    title.value = config.software.title;
});

const show = ref(false);

setTimeout(() => {
    show.value = true;
    setTimeout(() => {
        window.close();
    }, 4000);
}, 1500);
</script>
<style scoped>
.title {
    font-size: 8em;
    position: fixed;
    top: 35%;
    left: 40%;
    font-family: 'Caveat';
    font-weight: 700;
    letter-spacing: 0.5cm;
}

.notes {
    font-size: 2.5em;
    position: fixed;
    bottom: 5%;
    left: 0%;
    width: 100%;
    text-align: center;
    font-family: 'Caveat', 'SimSun';
    color: rgb(140, 140, 140);
    letter-spacing: 0.2cm;
}

* {
    user-select: none;
}
</style>
