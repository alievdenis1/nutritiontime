import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { i18n } from '@/shared/lib/i18n'
import './bootstrap'

const app = createApp(App)
const pinia = createPinia()

app
	.use(i18n)
	.use(pinia)
	.use(ElementPlus)
	.use(Router)

Object.entries(ElementPlusIcons).forEach(([key, icon]) => {
	app.component(`ElIcon${key}`, icon)
})

app.mount('#app')
