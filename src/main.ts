import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import Router from './router'
import * as ElementPlusIcons from '@element-plus/icons-vue'
import { i18n } from '@/shared/lib/i18n'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)
const pinia = createPinia()

pinia.use(createPersistedState())

app
	.use(i18n)
	.use(pinia)
	.use(ElementPlus)
	.use(VueApexCharts)
	.use(Router)

Object.entries(ElementPlusIcons).forEach(([key, icon]) => {
	app.component(`ElIcon${key}`, icon)
})

if (import.meta.env.VITE_USE_TWA_MOCK) {
    import('eruda').then(eruda => eruda.default.init())
}

app.mount('#app')