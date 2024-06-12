import { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'app/layouts'

export default [
	{
		name: 'recipe',
		component: () => import('pages/recipe/RecipePage.vue'), // Важно: динасический импорт, чтобы код работал в production при build
		path: '/:recipeId',
		meta: {
			title: 'Recipe',
			layout: MainLayout
		}
	}
] as RouteRecordRaw[]