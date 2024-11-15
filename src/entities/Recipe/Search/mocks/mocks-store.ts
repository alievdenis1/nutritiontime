import { ref } from 'vue'
import type { RecipesItem } from '@/entities/Recipe/RecipesList'

export const addPrefix = (url: string) => {
    const prefix = '/NutritionTime_Dev-test'
    return `${prefix}${url}`
}

export const recipesData = ref<RecipesItem[]>([
    {
        id: 1,
        title: 'Recipe Title',
        image: addPrefix('/image/recipes1.png'),
        author: { name: 'Author Name', image: addPrefix('/image/denis.svg') },
        rating: 4.5,
        cookingTime: 30,
        calories: 250,
        commentsCount: 10,
        time: '30 min',
        liked: true,
        likes: 100,
        likesCount: 200,
        savedToCollection: false
    },
    {
        id: 2,
        title: 'Recipe Title',
        image: addPrefix('/image/recipes1.png'),
        author: { name: 'Author Name', image: addPrefix('/image/denis.svg') },
        rating: 4.5,
        cookingTime: 30,
        calories: 250,
        commentsCount: 10,
        time: '30 min',
        liked: true,
        likes: 100,
        likesCount: 200,
        savedToCollection: false
    },
    {
        id: 3,
        title: 'Recipe Title',
        image: addPrefix('/image/recipes1.png'),
        author: { name: 'Author Name', image: addPrefix('/image/denis.svg') },
        rating: 4.5,
        cookingTime: 30,
        calories: 250,
        commentsCount: 10,
        time: '30 min',
        liked: true,
        likes: 100,
        likesCount: 200,
        savedToCollection: false
    },
])