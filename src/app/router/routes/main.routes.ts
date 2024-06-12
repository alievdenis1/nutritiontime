import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'main',
		component: () => import('pages/main/MainPage.vue'), // Важно: динасический импорт, чтобы код работал в production при build
		path: '/',
		meta: {
			title: 'Nutrition Time',
			layout: MainLayout
		}
	}
] as RouteRecordRaw[]
