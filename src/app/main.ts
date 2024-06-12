import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { i18n } from '@/shared/lib/i18n'

const app = createApp(App)
<<<<<<< HEAD
const pinia = createPinia()

app
	.use(i18n)
	.use(pinia)
=======

app
	.use(i18n)
	.use(createPinia())
>>>>>>> 4db838b8ef327e434b610b143407db4e4e5be584
	.use(ElementPlus)
	.use(Router)

Object.entries(ElementPlusIcons).forEach(([key, icon]) => {
	app.component(`ElIcon${key}`, icon)
})

app.mount('#app')
