import { Plan } from '../types'

export const DEBUG_DATA = {
	SAVED_PLANS_LIST: [
		{
			id: 0,
			name: 'Основной',
			isActive: true,
			caloriesPerDay: 2200,
			proteins: 25,
			fats: 40,
			carbohydrates: 25
		},
		{
			id: 1,
			name: 'Вкусный',
			caloriesPerDay: 12200,
			isActive: false,
			proteins: 25,
			fats: 40,
			carbohydrates: 25
		},
		{
			id: 2,
			name: 'Низкоуглеводный',
			caloriesPerDay: 32200,
			isActive: false,
			proteins: 25,
			fats: 50,
			carbohydrates: 25
		},
		{
			id: 3,
			name: 'Веганский',
			caloriesPerDay: 5000,
			isActive: false,
			proteins: 25,
			fats: 50,
			carbohydrates: 25
		},
		{
			id: 4,
			name: 'Любимый',
			caloriesPerDay: 1000,
			isActive: false,
			proteins: 25,
			fats: 50,
			carbohydrates: 25
		}
	] as Plan[]
}
