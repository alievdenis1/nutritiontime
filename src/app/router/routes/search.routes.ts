import { RouteRecordRaw } from 'vue-router'
import { MainLayout, DefaultLayout } from 'app/layouts'

export default [
	{
		name: 'search',
		component: () => import('pages/search/SearchPage.vue'),
		path: '/search',
		meta: {
			title: 'Search',
			layout: MainLayout
		}
	},
	{
		name: 'filter',
		component: () => import('pages/search/FilterRecipe.vue'),
		path: '/filter',
		meta: {
			title: 'Editing Recipe',
			layout: DefaultLayout,
			backButton: true,
		}
	}
] as RouteRecordRaw[]