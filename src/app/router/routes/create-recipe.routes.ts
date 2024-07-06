import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'create-recipe',
		component: () => import('pages/create-recipe/CreateRecipe.vue'),
		path: '/create-recipe',
		meta: {
			title: 'Create Recipe',
			layout: MainLayout
		}
	},
	{
		name: 'check-recipe',
		component: () => import('pages/create-recipe/CheckRecipe.vue'),
		path: '/check-recipe',
		meta: {
			title: 'Check Recipe',
			layout: MainLayout
		}
	},
] as RouteRecordRaw[]