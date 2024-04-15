import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'create-recipe',
		component: () => import('pages/create-recipe/CreateRecipe.vue'), // Важно: динамический импорт, чтобы код работал в production при build
		path: '/create-recipe',
		meta: {
			title: 'Create Recipe',
			layout: MainLayout
		}
	},
    {
		name: 'create-recipe-gpt',
		component: () => import('pages/create-recipe/CreateRecipeGPT.vue'),
		path: '/create-recipe-gpt',
		meta: {
			title: 'Create Recipe GPT',
			layout: MainLayout
		}
	},
    {
		name: 'create-recipe-manual',
		component: () => import('pages/create-recipe/CreateRecipeManually.vue'),
		path: '/create-recipe-manual',
		meta: {
			title: 'Create Recipe Manual',
			layout: MainLayout
		}
	}
] as RouteRecordRaw[]