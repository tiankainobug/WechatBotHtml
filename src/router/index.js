import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddView from "@/views/AddView.vue";
import Logout from "@/views/Logout.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/add',
            name: 'Add',
            component: AddView
        },
        {
            path: '/logout',
            name: 'Logout',
            component: Logout
        }
    ]
})

export default router
