import authRoutes from './auth.routes'
import mainRoutes from './main.routes'
import recipeRoutes from './recipe.routes'
import createRecipeRoutes from './create-recipe.routes'

export default [
	...authRoutes,
	...mainRoutes,
	...recipeRoutes,
	...createRecipeRoutes
]
