import type { User } from '@/entities/User/@x/Comment'

export type Comment = {
    id: number;
    text: string;
    likes: number;
    image?: string;
    rating: number;
    user: User;
}