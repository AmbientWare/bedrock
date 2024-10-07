import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

import type { User, Session, AllowedUserEmails } from './models'
import { UserRole } from './models'
import { stripe } from '$lib/server/config'
import { generateToken } from './tokens'
import { app_settings } from './config'

const supabase = createClient(app_settings.PUBLIC_SUPABASE_URL, app_settings.PUBLIC_SUPABASE_ANON_KEY!)

let DB_INITIALIZED = false

export async function initDb() {
    if (DB_INITIALIZED) {
        return
    }

    try {
        // Check if admin email is allowed
        if (!(await checkAllowedUserEmail('admin@example.com'))) {
            console.log('creating allowed user email')
            await createAllowedUserEmail('admin@example.com')
            console.log('allowed user email created')
        }
        // Create admin user if not exists
        if (!(await userByEmail('admin@example.com'))) {
            await createUser('Admin', 'admin@example.com', 'admin', UserRole.ADMIN)
        }

        DB_INITIALIZED = true
    } catch (error) {
        console.error('Error during database initialization:', error)
        throw error
    }
}

// User functions

export async function getUsers(): Promise<User[]> {
    const { data, error } = await supabase
        .from('users')
        .select('*')

    if (error) {
        console.error('Error getting users:', error)
        throw new Error('Failed to get users')
    }

    return data as User[]
}

export async function userByAccessToken(access_token: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('access_token', access_token)
        .maybeSingle()

    if (error) {
        console.error('Error querying user by token:', error)
        throw new Error('Failed to query user by token')
    }

    return data as User | null
}

export async function userByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle()

    if (error) {
        console.error('Error querying user by email:', error)
        return null
    }

    return data as User | null
}

export async function userByOauthId(oauthId: string): Promise<User | null> {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('oauth_id', oauthId)
        .maybeSingle()

    if (error) {
        console.error('Error querying user by oauth ID:', error)
        throw new Error('Failed to query user by oauth ID')
    }

    return data as User | null
}

export async function userBySessionId(session_id: string | null | undefined): Promise<User | null> {
    if (session_id === null || session_id === undefined) {
        return null
    }

    const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select('user_id')
        .eq('id', session_id)
        .maybeSingle()

    if (sessionError) {
        console.error('Error getting session:', sessionError)
        throw new Error('Failed to get session')
    }

    if (!session) {
        return null
    }

    const { data: user, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user_id)
        .maybeSingle()

    if (userError) {
        console.error('Error getting user by session ID:', userError)
        throw new Error('Failed to get user by session ID')
    }

    return user as User | null
}

export async function deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting user:', error)
        throw new Error('Failed to delete user')
    }

    return true
}

export async function deleteUsers(ids: string[]): Promise<boolean> {
    const { error } = await supabase
        .from('users')
        .delete()
        .in('id', ids)

    if (error) {
        console.error('Error deleting users:', error)
        throw new Error('Failed to delete users')
    }

    return true
}

export async function createUser(
    name: string,
    email: string,
    oauth_id: string,
    role: typeof UserRole[keyof typeof UserRole] = UserRole.USER
): Promise<User | null> {
    const stripeCustomer = await stripe.customers.create({
        name,
        email
    })

    const access_token = generateToken()

    if (!access_token) {
        throw new Error('Failed to create user token.')
    }

    const newUser = {
        stripe_customer_id: stripeCustomer.id,
        email,
        name,
        oauth_id,
        role,
        access_token
    }

    const { data, error } = await supabase
        .from('users')
        .insert(newUser)
        .maybeSingle()

    if (error) {
        console.error('Error creating user:', error)
        throw new Error('Failed to create user')
    }

    return data as User | null
}

export async function updateUser(user: User): Promise<boolean> {
    const { error } = await supabase
        .from('users')
        .update(user)
        .eq('id', user.id)

    if (error) {
        console.error('Error updating user:', error)
        throw new Error('Failed to update user')
    }

    return true
}

// Sessions

export async function createSession(user_id: string, token: string, expires_at: number): Promise<Session | null> {
    const { data, error } = await supabase
        .from('sessions')
        .insert({ user_id, token, expires_at })
        .select()
        .maybeSingle()
    if (error) {
        console.error('Error creating session:', error)
        throw new Error('Failed to create session')
    }

    return data as Session | null
}

export async function deleteSession(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting session:', error)
        throw new Error('Failed to delete session')
    }

    return true
}

export async function deleteSessionByUserId(user_id: string): Promise<boolean> {
    const { error } = await supabase
        .from('sessions')
        .delete()
        .eq('user_id', user_id)

    if (error) {
        console.error('Error deleting session by user ID:', error)
        throw new Error('Failed to delete session by user ID')
    }

    return true
}

export async function getSession(id: string | null | undefined): Promise<Session | null> {
    if (!id) {
        return null
    }

    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', id)
        .maybeSingle()

    if (error) {
        console.error('Error getting session:', error)
        return null
    }

    if (!data || Date.now() > data.expires_at) {
        return null
    }

    return data as Session
}

export async function sessionByUserId(user_id: string): Promise<Session | null> {
    const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', user_id)
        .maybeSingle()

    if (error) {
        console.error('Error querying session by user ID:', error)
        throw new Error('Failed to query session by user ID')
    }

    return data as Session | null
}

export async function updateSession(session: Session): Promise<boolean> {
    const { error } = await supabase
        .from('sessions')
        .update(session)
        .eq('id', session.id)

    if (error) {
        console.error('Error updating session:', error)
        throw new Error('Failed to update session')
    }

    return true
}

export async function validateSession(id: string): Promise<boolean> {
    const session = await getSession(id)
    return session && Date.now() < session.expires_at ? true : false
}

export async function refreshSession(user_id: string): Promise<Session | null> {
    const session = await sessionByUserId(user_id)

    if (!session) {
        return null
    }

    const newSession = {
        ...session,
        expires_at: Date.now() + 60 * 60 * 24 * 1000 // 1 day
    }

    const success = await updateSession(newSession)

    return success ? newSession : null
}

// Allowed User Emails

export async function getAllowedUserEmails(): Promise<AllowedUserEmails[]> {
    const { data, error } = await supabase
        .from('allowed_user_emails')
        .select('*')

    if (error) {
        console.error('Error getting allowed user emails:', error)
        throw new Error('Failed to get allowed user emails')
    }

    return data as AllowedUserEmails[]
}

export async function createAllowedUserEmail(email: string): Promise<boolean> {
    const { error } = await supabase
        .from('allowed_user_emails')
        .insert({ id: uuidv4(), email: email })

    if (error) {
        console.error('Error creating allowed user email:', error)
        throw new Error('Failed to create allowed user email')
    }

    return true
}

export async function deleteAllowedUserEmails(ids: string[]): Promise<boolean> {
    const { error } = await supabase
        .from('allowed_user_emails')
        .delete()
        .in('id', ids)

    if (error) {
        console.error('Error deleting allowed user emails:', error)
        throw new Error('Failed to delete allowed user emails')
    }

    return true
}

export async function checkAllowedUserEmail(email: string): Promise<boolean> {
    const { data, error } = await supabase
        .from('allowed_user_emails')
        .select('id')
        .eq('email', email)
        .limit(1)

    if (error) {
        console.error('Error checking allowed user email:', error)
        throw new Error('Failed to check allowed user email')
    }

    return data && data.length > 0
}
