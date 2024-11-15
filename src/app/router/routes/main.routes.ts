import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'main',
		component: () => import('pages/main/MainPage.vue'),
		// component: () => import('pages/wallet/UserWallet.vue'), // Важно: динасический импорт, чтобы код работал в production при build
		path: '/',
		meta: {
			title: 'NutritionTime',
			layout: MainLayout
		},
	},
	{
		path: '/payment/',
		component: () => import('pages/payment/PaymentPage.vue'),
		name: 'payment',
		meta: {
			title: 'NutritionTime',
			layout: MainLayout,
			requiresAuth: true
		}
	}
] as RouteRecordRaw[]
