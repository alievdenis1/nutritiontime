import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

// const BASE_URL = 'nutritiontime'

export default createRouter({
	history: createWebHashHistory(),
	scrollBehavior() {
		return { top: 0 }
	},
	routes
})
