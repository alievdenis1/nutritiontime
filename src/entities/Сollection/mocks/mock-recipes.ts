import { RecipesList } from '../../Recipe/ui/type'

export const addPrefix = (url: string) => {
    const prefix = '/nutritiolntime'
    return `${prefix}${url}`
}

export const mockRecipes: RecipesList = [
    {
        'id': 1,
        'image': addPrefix('/image/recipes1.png'),
        'title': 'Вкуснейший домашний бургер',
        'rating': '5.0',
        'time': '35 мин',
        'calories': '300 ккал',
        'author': {
            'name': 'Денис Алиев',
            'profile_image': addPrefix('/image/denis.svg')
        },
        'comments': 0,
        'bookmarked': false,
        'liked': false
    },
    {
        'id': 2,
        'image': addPrefix('/image/recipes1.png'),
        'title': 'Вкуснейший домашний бургер',
        'rating': '5.0',
        'time': '35 мин',
        'calories': '300 ккал',
        'author': {
            'name': 'Денис Алиев',
            'profile_image': addPrefix('/image/denis.svg')
        },
        'comments': 0,
        'bookmarked': false,
        'liked': false
    },
    {
        'id': 3,
        'image': addPrefix('/image/recipes1.png'),
        'title': 'Вкуснейший домашний бургер',
        'rating': '5.0',
        'time': '35 мин',
        'calories': '300 ккал',
        'author': {
            'name': 'Денис Алиев',
            'profile_image': addPrefix('/image/denis.svg')
        },
        'comments': 0,
        'bookmarked': false,
        'liked': false
    },
    {
        'id': 4,
        'image': addPrefix('/image/recipes1.png'),
        'title': 'Вкуснейший домашний бургер',
        'rating': '5.0',
        'time': '35 мин',
        'calories': '300 ккал',
        'author': {
            'name': 'Денис Алиев',
            'profile_image': addPrefix('/image/denis.svg')
        },
        'comments': 0,
        'bookmarked': false,
        'liked': false
    },
]