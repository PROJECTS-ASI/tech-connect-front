export interface User {
    id: string
    first_name: string
    last_name: string
    academic_cycle: string | null
    biography: string | null
    avatar_url: string | null
    tech_stack: string[]
    created_at: string
    updated_at: string
};