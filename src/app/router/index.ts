import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const BASE_URL = '/'

export default createRouter({
	history: createWebHistory(BASE_URL),
	routes
})
