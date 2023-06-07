import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'
import MainPage from 'pages/main/MainPage.vue'

export default [
	{
		name: 'main',
		component: () => MainPage,
		path: '/',
		meta: {
			title: 'Nutrition Time',
			layout: MainLayout
		}
	}
] as RouteRecordRaw[]
