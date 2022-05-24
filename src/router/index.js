import { createRouter, createWebHistory } from 'vue-router';

import TasksComponent from '../views/Tasks.vue'
import AuthComponent from '../views/Auth.vue'

const routes = [
    {
        path: "/",
        component: TasksComponent,
    },

    {
        path: "/auth",
        component: AuthComponent,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;