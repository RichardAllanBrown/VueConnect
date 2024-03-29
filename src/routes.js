
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import WallPage from './pages/WallPage.vue'

const routes = [
    { name: "home", path: '/', component: HomePage },
    { name: "wall", path: '/wall/:wallId', component: WallPage, props: true }
]

export default createRouter({
    history: createWebHistory(),
    routes,
})
