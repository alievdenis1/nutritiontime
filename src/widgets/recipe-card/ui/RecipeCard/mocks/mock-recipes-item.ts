import { Recipe } from '@/entities/Recipe'

export const addPrefix = (url: string) => {
    const prefix = '/NutritionTime_Dev-test'
    return `${prefix}${url}`
}

export const mockRecipe: Recipe[] = [
    {
        id: '1',
        title: 'Вкуснейший домашний бургер',
        description: 'Это рецепт вкуснейшего домашнего бургера, который очень просто приготовить',
        image: addPrefix('/image/recipes1.png'),
        author: {
            id: 1,
            name: 'Денис Алиев',
            avatar: '/image/denis.svg'
        },
        ingredients: [
            // id: number;
            // name: string;
            // amount: number;
            // unit: number;
            { id: 1, name: 'Булочка для бургера', amount: 1, unit: 'g' },
            { id: 2, name: 'Говядина', amount: 300, unit: 'g' },
            { id: 3, name: 'Лук', amount: 300, unit: 'g'  },
            { id: 4, name: 'Сыр Чедер', amount: 300, unit: 'g'  },
            { id: 5, name: 'Маринованные огурцы', amount: 300, unit: 'g'  },
            { id: 6, name: 'Подсолнечное масло', amount: 300, unit: 'g' },
            { id: 7, name: 'Соус для бургера', amount: 300, unit: 'g'  },
        ],
        total_weight: 800,
        steps: [
            {
                id:1,
                order: 1,
                description: 'Подготавливаем необходимые ингредиенты для бургера',
                image: addPrefix('/image/recipes3.png')
            },
            {
                id:2,
                order: 2,
                description: 'В мясной фарш добавляем соль и перец по вкусу, хорошо вымешиваем. Формируем шарик, расплющиваем его в руках, чтобы получилась плоская котлета. Надавливаем большим пальцем в центр котлеты, чтобы она не вздулась во время обжаривания.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                id:3,
                order: 3,
                description: 'Обжариваем котлету 4-5 минут с каждой стороны.На готовую котлету кладем тонкий кусочек сыра.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                id:4,
                order: 4,
                description: 'Помидоры нарезаем кружочками, твердый сыр - тонкими пластинами, соленый огурец - тонкими кружочками.В отдельной емкости смешиваем майонез и кетчуп.',
                image: addPrefix('/image/recipes1.png')
            },
            {
                id:5,
                order: 5,
                description: 'На котлету выкладываем пару ломтиков соленого огурца и ломтик сыра.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                id:6,
                order: 6,
                description: 'Накрываем бургер второй частью булочки. По такому же принципу формируем остальные бургеры. Приятного аппетита!',
                image: addPrefix('/image/recipes3.png')
            },
        ],
        calories: 350,
        carbohydrates: 54,
        category: {
            id: 1,
            name: 'Завтраки',
        },
        cooking_time: 30,
        cuisine: {
            id: 1,
            name: 'Итальянская',
        },
        dietType: {
            id: 1,
            name: 'Безглютеновый'
        },
        difficulty: 5,
        fats: 34,
        proteins: 100,
        spiciness: 5,
        total_time: 60,
        kitchenware: [{ name: 'Сковородка', quantity: 1, id: 1 }],
        tags: [{ category: 'test', id: 1, name: 'tag1' }, { category: 'test', id: 2, name: 'tag2' }, { category: 'test', id: 3, name: 'tag3' }],
        comments: [
            {
                user: {
                    id: 1,
                    name: 'Игнат Балышев',
                    avatar: addPrefix('/image/denis.svg'),
                },
                id: 1,
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 0,
                rating: 5,
                image: addPrefix('/image/recipes2.png'),
            },
            {
                user: {
                    id: 1,
                    name: 'Игнат Балышев',
                    avatar: addPrefix('/image/denis.svg'),
                },
                id: 1,
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 12,
                rating: 5,
                // image: null,
            },
            {
                user: {
                    id: 1,
                    name: 'Игнат Балышев',
                    avatar: addPrefix('/image/denis.svg'),
                },
                id: 1,
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 24,
                rating: 5,
                image: addPrefix('/image/recipes2.png'),
            }
        ],
    },
    {
        id: '2',
        title: 'Вкуснейший домашний бургер',
        description: 'Это рецепт вкуснейшего домашнего бургера, который очень просто приготовить',
        image: addPrefix('/image/recipes1.png'),
        author: {
            id: 1,
            name: 'Денис Алиев',
            avatar: '/image/denis.svg'
        },
        ingredients: [
            // id: number;
            // name: string;
            // amount: number;
            // unit: number;
            { id: 1, name: 'Булочка для бургера', amount: 1, unit: 'g' },
            { id: 2, name: 'Говядина', amount: 300, unit: 'g' },
            { id: 3, name: 'Лук', amount: 300, unit: 'g'  },
            { id: 4, name: 'Сыр Чедер', amount: 300, unit: 'g'  },
            { id: 5, name: 'Маринованные огурцы', amount: 300, unit: 'g'  },
            { id: 6, name: 'Подсолнечное масло', amount: 300, unit: 'g' },
            { id: 7, name: 'Соус для бургера', amount: 300, unit: 'g'  },
        ],
        total_weight: 800,
        steps: [
            {
                id:1,
                order: 1,
                description: 'Подготавливаем необходимые ингредиенты для бургера',
                image: addPrefix('/image/recipes3.png')
            },
            {
                id:2,
                order: 2,
                description: 'В мясной фарш добавляем соль и перец по вкусу, хорошо вымешиваем. Формируем шарик, расплющиваем его в руках, чтобы получилась плоская котлета. Надавливаем большим пальцем в центр котлеты, чтобы она не вздулась во время обжаривания.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                id:3,
                order: 3,
                description: 'Обжариваем котлету 4-5 минут с каждой стороны.На готовую котлету кладем тонкий кусочек сыра.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                id:4,
                order: 4,
                description: 'Помидоры нарезаем кружочками, твердый сыр - тонкими пластинами, соленый огурец - тонкими кружочками.В отдельной емкости смешиваем майонез и кетчуп.',
                image: addPrefix('/image/recipes1.png')
            },
            {
                id:5,
                order: 5,
                description: 'На котлету выкладываем пару ломтиков соленого огурца и ломтик сыра.',
                image: addPrefix('/image/recipes2.png')
            },
            {
                id:6,
                order: 6,
                description: 'Накрываем бургер второй частью булочки. По такому же принципу формируем остальные бургеры. Приятного аппетита!',
                image: addPrefix('/image/recipes3.png')
            },
        ],
        calories: 350,
        carbohydrates: 54,
        category: {
            id: 1,
            name: 'Завтраки',
        },
        cooking_time: 30,
        cuisine: {
            id: 1,
            name: 'Итальянская',
        },
        dietType: {
            id: 1,
            name: 'Безглютеновый'
        },
        difficulty: 5,
        fats: 34,
        proteins: 100,
        spiciness: 5,
        total_time: 60,
        kitchenware: [{ name: 'Сковородка', quantity: 1, id: 1 }],
        tags: [{ category: 'test', id: 1, name: 'tag1' }, { category: 'test', id: 2, name: 'tag2' }, { category: 'test', id: 3, name: 'tag3' }],
        comments: [
            {
                user: {
                    id: 1,
                    name: 'Игнат Балышев',
                    avatar: addPrefix('/image/denis.svg'),
                },
                id: 1,
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 0,
                rating: 5,
                image: addPrefix('/image/recipes2.png'),
            },
            {
                user: {
                    id: 1,
                    name: 'Игнат Балышев',
                    avatar: addPrefix('/image/denis.svg'),
                },
                id: 1,
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 12,
                rating: 5,
                // image: null,
            },
            {
                user: {
                    id: 1,
                    name: 'Игнат Балышев',
                    avatar: addPrefix('/image/denis.svg'),
                },
                id: 1,
                text: 'Рецепт классный, получилось с первого раза и очень вкусно! Автору респект',
                likes: 24,
                rating: 5,
                image: addPrefix('/image/recipes2.png'),
            }
        ],
    },
]
