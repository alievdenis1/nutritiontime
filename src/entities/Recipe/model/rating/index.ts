export const calculateRecipeRating = (comments:{
	author: string;
	text: string;
	likes: number;
	image: string | null;
	rating: number,
	authorImage?: string | null;
}[]) => {
	return comments.reduce((sum, comment) => sum += comment.rating,0) / comments.length
}
