import { RouteRecordRaw } from 'vue-router'
import { DefaultLayout, NavigateLayout } from 'app/layouts'

export default [
	{
		name: 'create-recipe',
		component: () => import('pages/create-recipe/CreateRecipe.vue'),
		path: '/create-recipe',
		meta: {
			title: 'Create Recipe',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		name: 'check-recipe',
		component: () => import('pages/create-recipe/CheckRecipe.vue'),
		path: '/check-recipe',
		meta: {
			title: 'Check Recipe',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		name: 'tag-recipe',
		component: () => import('pages/create-recipe/TagSelectionRecipe.vue'),
		path: '/tag-recipe',
		meta: {
			title: 'Tags Recipe',
			layout: DefaultLayout,
			backButton: true,
		}
	},
	{
		name: 'select-recipe',
		component: () => import('pages/create-recipe/SelectRecipeRecipe.vue'),
		path: '/select-recipe',
		meta: {
			title: 'Select Recipe',
			layout: DefaultLayout,
			backButton: true,
		}
	},
	{
		name: 'ideas-recipe',
		component: () => import('pages/create-recipe/ReadyIdeasRecipe.vue'),
		path: '/ideas-recipe',
		meta: {
			title: 'Select Recipe',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		name: 'ingredient-recipe',
		component: () => import('pages/create-recipe/CreateIngredientRecipe.vue'),
		path: '/ingredient-recipe',
		meta: {
			title: 'Select Recipe',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		name: 'details-recipe',
		component: () => import('pages/create-recipe/CardRecipe.vue'),
		path: '/recipe/:id',
		meta: {
			title: 'Recipe',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		// TODO: не забыть удалить
		// тестовый роут
		name: 'recipe-card',
		component: () => import('pages/recipe/ui/RecipeCard/RecipeCard.vue'),
		path: '/recipe/test',
		meta: {
			title: 'Recipe',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		name: 'all-comment',
		component: () => import('pages/create-recipe/AllComment.vue'),
		path: '/all-comment/:id',
		meta: {
			title: 'All Comment',
			layout: NavigateLayout,
			backButton: true,
		}
	},
	{
		name: 'recipe-edit',
		component: () => import('pages/create-recipe/EditingRecipe.vue'),
		path: '/recipe/:id/edit',
		meta: {
			title: 'Editing Recipe',
			layout: DefaultLayout,
			backButton: true,
		}
	},
] as RouteRecordRaw[]