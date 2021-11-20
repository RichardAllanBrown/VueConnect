
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/pages/HomePage.vue'
import WallPage from './components/pages/WallPage.vue'

const routes = [
    { path: '/', component: HomePage },
    { path: '/wall', component: WallPage }
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
