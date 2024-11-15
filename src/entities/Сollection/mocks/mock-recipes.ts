import { RecipesList } from '../../Recipe/RecipesList/type'

export const addPrefix = (url: string) => {
    const prefix = '/NutritionTime_Dev-test'
    return `${prefix}${url}`
}

export const mockRecipes: RecipesList = [
    {
        id: 1,
        collectionId: 1,
        image: addPrefix('/image/recipes1.png'),
        title: 'Вкуснейший домашний бургер',
        rating: 5.0, // Должен быть числом, если интерфейс указывает на число
        time: '35 мин',
        calories: 300, // Должен быть числом, если интерфейс указывает на число
        author: {
            name: 'Денис Алиев',
            image: addPrefix('/image/denis.svg') // Используем правильное имя поля
        },
        commentsCount: 0,
        cookingTime: 35, // Добавлено поле cookingTime
        liked: false,
        favourited: false,
        likes: 2,
        savedToCollection: false // Добавлено новое поле для сохранения в коллекцию
    },
    {
        id: 2,
        collectionId: 1,
        image: addPrefix('/image/recipes1.png'),
        title: 'Вкуснейший домашний бургер',
        rating: 5.0,
        time: '35 мин',
        calories: 300,
        author: {
            name: 'Денис Алиев',
            image: addPrefix('/image/denis.svg')
        },
        commentsCount: 0,
        cookingTime: 35,
        liked: false,
        favourited: false,
        likes: 2,
        savedToCollection: false
    },
    {
        id: 3,
        collectionId: 1,
        image: addPrefix('/image/recipes1.png'),
        title: 'Вкуснейший домашний бургер',
        rating: 5.0,
        time: '35 мин',
        calories: 300,
        author: {
            name: 'Денис Алиев',
            image: addPrefix('/image/denis.svg')
        },
        commentsCount: 0,
        cookingTime: 35,
        liked: false,
        favourited: false,
        likes: 2,
        savedToCollection: false
    },
    {
        id: 4,
        collectionId: 1,
        image: addPrefix('/image/recipes1.png'),
        title: 'Вкуснейший домашний бургер',
        rating: 5.0,
        time: '35 мин',
        calories: 300,
        author: {
            name: 'Денис Алиев',
            image: addPrefix('/image/denis.svg')
        },
        commentsCount: 0,
        cookingTime: 35,
        liked: false,
        favourited: false,
        likes: 2,
        savedToCollection: false
    },
]