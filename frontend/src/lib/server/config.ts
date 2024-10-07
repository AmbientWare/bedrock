import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import Stripe from 'stripe'
import { google } from 'googleapis'



import {
    ENV,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
    AWS_REGION,
    STRIPE_SECRET_KEY,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    API_URL,
    DATAROOM_PATH,
} from '$env/static/private'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const app_settings = {
    ENV: ENV,
    API_URL: API_URL,
    DATAROOM_PATH: DATAROOM_PATH,
    PUBLIC_SUPABASE_URL: PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: PUBLIC_SUPABASE_ANON_KEY
}

// AWS Configuration
const client = new DynamoDBClient({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY
    }
})

export const dynamoDB = DynamoDBDocumentClient.from(client)

// Stripe Configuration
export const stripe = new Stripe(STRIPE_SECRET_KEY)

// Google OAuth Configuration
export const googleOAuth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
)
