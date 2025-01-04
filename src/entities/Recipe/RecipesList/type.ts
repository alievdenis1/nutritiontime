interface Author {
	name: string;
	image: string;
}

export interface RecipeItem {
	'id': number,
	'title': string,
	'description': string,
	'image': string, // url
	'author_id': number,
	'category_id': number,
	'cuisine_id': number,
	'diet_type_id': number,
	'difficulty': number,
	'spiciness': number,
	'cooking_time': number,
	'total_time': number,
	'calories': number,
	'proteins': number,
	'fats': number,
	'carbohydrates': number,
	'total_weight': number,
	'created_at': string,
	'updated_at': string,
	'likes_count': number,
	'total_comments_count': number,
	'average_rating': number | null,
	'is_favorited': boolean,
	'collection_ids': number[],
	'category': {
		'id': number,
		'name': string,
		'created_at': string | null,
		'updated_at': string | null
	},
	'cuisine': {
		'id': number,
		'name': string,
		'created_at': string | null,
		'updated_at': string | null
	},
	'diet_type': {
		'id': number,
		'name': string,
		'created_at': string | null,
		'updated_at': string | null
	},
	'pivot': {
		'collection_id': number,
		'recipe_id': number,
		'created_at': string | null,
		'updated_at': string | null
	}
}
