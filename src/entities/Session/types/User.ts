export type User = {
    id: number;
    name: string;
    email: string;
    telegram_id: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}