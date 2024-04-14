import authRoutes from './auth.routes'
import mainRoutes from './main.routes'
import recipeRoutes from './recipe.routes'

export default [
	...authRoutes,
	...mainRoutes,
	...recipeRoutes
]
