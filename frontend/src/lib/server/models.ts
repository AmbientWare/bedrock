export const UserRole = {
    USER: 'user',
    ADMIN: 'admin'
} as const

export interface User {
    id: string
    oauth_id?: string
    name?: string
    email?: string
    role?: typeof UserRole[keyof typeof UserRole]
    access_token?: string
}

export interface Session {
    id: string
    user_id: string
    token: string
    expires_at: number
}

export interface AllowedUserEmails {
    id: string
    email: string
}
