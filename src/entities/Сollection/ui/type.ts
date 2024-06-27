interface Author {
	name: string;
	profile_image: string;
}

export interface RecipeItem {
	id: number;
	image: string;
	title: string;
	rating: string;
	time: string;
	calories: string;
	author: Author;
	comments: number;
	bookmarked: boolean;
	liked: boolean;
}

export type RecipeList = RecipeItem[]
