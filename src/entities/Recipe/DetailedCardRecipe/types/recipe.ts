export interface Ingredient {
    name: string;
    amount: string;
}

export interface CookingStep {
    description: string;
    image: string;
}

export interface RecipeInfo {
    [key: string]: string;
}

export interface NutritionInfo {
    [key: string]: string;
}

export interface Author {
    name: string;
    image: string;
}

export interface Comment {
    author: string;
    text: string;
    likes: number;
    image: string | null;
    authorImage?: string | null;
}

export interface Recipe {
    id: number | string;
    title: string;
    description: string;
    image: string;
    author: {
        name: string;
        image: string;
    };
    rating: number;
    favourited: boolean,
    reviewsCount: number;
    ingredients: Array<{ name: string, amount: string, type: 'weight' | 'quantity' }>;
    totalWeight: number;
    cookingSteps: Array<{ description: string; image: string }>;
    recipeInfo: Record<string, string>;
    nutritionInfo: Record<string, string>;
    kitchenware: Array<{ name: string; quantity: string }>;
    tags: string[];
    comments: Array<{
        author: string;
        text: string;
        likes: number;
        image: string | null;
        rating: number,
        authorImage?: string | null;
    }>;
    nftOwner: {
        name: string;
        image: string;
    };
}