import { createApp } from 'vue'
import './styles/index.css'
import App from 'app/App.vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import Router from 'app/router'

const app = createApp(App)

app
	.use(createPinia())
	.use(ElementPlus)
	.use(Router)

app.mount('#app')
