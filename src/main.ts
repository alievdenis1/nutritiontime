import { createApp } from 'vue'
import './index.css'
import App from './app/App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

const app = createApp(App)

app
	.use(createPinia())
	.use(ElementPlus)

app.mount('#app')
