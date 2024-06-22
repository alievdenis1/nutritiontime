export type Plan = {
	id: number,
	name: string,
	isActive: boolean,
	caloriesPerDay: number,
	proteins: number,
	fats: number,
	carbohydrates: number,
	[key: string]: string | number | symbol | undefined | boolean
};

export interface Tab {
	id: number
	label: string
	isActiveEdit: boolean
	count: number
}