import type { Category } from '@/entities/Category/@x/Recipe'
import type { Cuisine } from '@/entities/Cuisine/@x/Recipe'
import type { DietType } from '@/entities/DietType/@x/Recipe'
import type { Ingredient } from '@/entities/Ingredient/@x/Recipe'
import type { Kitchenware } from '@/entities/Kitchenware/@x/Recipe'
import type { Step } from '@/entities/Step/@x/Recipe'
import type { Tag } from '@/entities/Tag/@x/Recipe'
import type { Comment } from '@/entities/Comment/@x/Recipe'
import type { User } from '@/entities/User/@x/Recipe'

// export type Ingredient = {
//     id: number;
//     name: string;
//     amount: number;
//     unit: number;
// }

// export type Comment = {
//     id: number;
//     text: string;
//     likes: number;
//     image?: string;
//     rating: number;
//     user: {
//         name: string;
//         // TODO: не уверен, что такое поле существует
//         avatar?: string;
//     };
// }

export type Recipe = {
    id: string;
    title: string,
    description: string,
    image: string,
    // TODO: удалить лишние комментарии
    // author_id: string,
    // category_id: string,
    // cuisine_id: string,
    // diet_type_id: string,
    difficulty: number,
    spiciness: number,
    cooking_time: number,
    total_time: number,
    calories: number,
    proteins: number,
    fats: number,
    carbohydrates: number,
    total_weight: number,
    // TODO: нужно на бэке добавить поле total_rating, чтобы на фронте не высчитывать по комментам
    // TODO: нужно как-то обозначать есть ли этот рецепт в избранных у пользователя

    // TODO: author - это сущность User
    // TODO: расширить в соответствии с сущностью User
    author: User,
    category: Category;
    cuisine: Cuisine;
    dietType: DietType;
    ingredients: Ingredient[];
    kitchenware: Kitchenware[];
    steps: Step[];
    tags: Tag[];
    comments: Comment[];
    // TODO: нужно ли поле nftUser????
}
