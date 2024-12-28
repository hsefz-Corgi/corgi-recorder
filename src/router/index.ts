import { createRouter, createWebHashHistory } from 'vue-router'

import configView from '@/views/configView.vue';
import setupView from '@/views/setupView.vue';
import recordView from '@/views/recordView.vue';
import errorView from '@/views/errorView.vue';
import inputView from '@/views/inputView.vue';
import progressView from '@/views/progressView.vue';

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'setup',
            path: '/setup',
            component: setupView
        },
        {
            name: 'config',
            path: '/config',
            component: configView
        },
        {
            name: 'record',
            path: '/record',
            component: recordView
        },
        {
            name: 'error',
            path: '/error',
            component: errorView
        },
        {
            name: 'input',
            path: '/input',
            component: inputView
        },
        {
            name: 'progress',
            path: '/progress',
            component: progressView
        }
    ],
})

export default router
