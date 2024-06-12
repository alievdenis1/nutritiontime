export type RecipeItem = {
	id: number,
	title: string,
	desc: string,
	img?: string,
	address: string,
	time: number,
	kkal: number
}

export type RecipeList = RecipeItem[]

