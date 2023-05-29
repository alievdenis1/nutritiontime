import { RouteRecordRaw } from 'vue-router'
import { DefaultLayout, AuthLayout } from 'app/layouts'
import StartPage from 'pages/auth/StartPage.vue'
import SelectAuthTypePage from "pages/auth/SelectAuthTypePage.vue";
import AuthPage from 'pages/auth/AuthPage.vue'

export default [
	{
		component: () => StartPage,
		path: '/start',
		name: 'Start',
		meta: {
			title: 'Start',
			layout: DefaultLayout
		}
	},
	{
		component: () => SelectAuthTypePage,
		path: '/select-auth-type',
		name: 'SelectAuthType',
		meta: {
			title: 'Select Auth Type',
			layout: DefaultLayout
		}
	},
	{
		component: () => AuthPage,
		path: '/auth',
		name: 'Auth',
		meta: {
			title: 'AuthScreen',
			layout: AuthLayout
		}
	}
] as RouteRecordRaw[]
