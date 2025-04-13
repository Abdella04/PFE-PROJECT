export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'employee';
    created_at: string;
    updated_at: string;
} 