import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const BASE_URL = 'nutritiontime'

export default createRouter({
	history: createWebHistory(BASE_URL),
	scrollBehavior() {
		return { top: 0 }
	},
	routes
})
