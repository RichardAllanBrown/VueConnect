import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { store, key } from './store'
import router from './routes.js'

const app = createApp(App)
app.use(store, key)
app.use(router)

app.mount('#app')
