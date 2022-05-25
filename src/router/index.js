import { createRouter, createWebHistory } from 'vue-router';

import HomeComponent from '../views/Home.vue'
import AuthComponent from '../views/Auth.vue'
import TaskComponent from '../views/Task.vue'

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeComponent,
    },

    {
        path: "/auth",
        name: "auth",
        component: AuthComponent,
    },

    {
        path: "/tasks/:id",
        name: "task",
        component: TaskComponent
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;