import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '../views/Home.vue'
import AuthView from '../views/Auth.vue'
import TaskView from '../views/Task.vue'
import EditorView from '../views/Editor.vue'

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },

    {
        path: "/auth",
        name: "auth",
        component: AuthView,
    },

    {
        path: "/tasks/:id",
        name: "task",
        component: TaskView
    },
    {
        path: "/editor/:id",
        name: "editor",
        component: EditorView,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;