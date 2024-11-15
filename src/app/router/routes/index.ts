import authRoutes from './auth.routes'
import mainRoutes from './main.routes'
import searchRoutes from './search.routes'
import createRecipeRoutes from './create-recipe.routes'
import userWalletRoutes from './user-wallet.routes'

export default [
	...authRoutes,
	...mainRoutes,
	...searchRoutes,
	...createRecipeRoutes,
	...userWalletRoutes
]
