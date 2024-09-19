import { json } from '@sveltejs/kit'
import { OpenAI } from 'openai'
import { error } from '@sveltejs/kit'

import type { Message } from '$lib/interfaces/interfaces'
import { ENV } from '$lib/server/config'

export async function POST({ request }) {
    const { data } = await request.json()
    const messages: Message[] = data.messages
    const additionalContext = data.additionalContext
    const fileContents = data.fileContents

    // pop the latest message
    const latestMessage = messages[messages.length - 1]

    if (!latestMessage) {
        error(400, 'No message provided')
    }

    latestMessage.content =
        "Prompt: You have already helped a user with due diligence on a company. Now, you are helping them chat over the results. The user has already provided some important context and you have provided some initial thoughts. Now, continue the conversation in a friendly, professional tone." +
        "User Message: " + latestMessage.content + "\n" +
        "User Provided Important Context: " + additionalContext + "\n" +
        "Complete File Contents: " + fileContents

    // replace the last message with the modified message
    messages[messages.length - 1] = latestMessage

    const openai = new OpenAI({
        apiKey: ENV.OPENAI_API_KEY
    })

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages
        })

        console.log(response.choices[0].message.content)

        return json({ message: response.choices[0].message.content })
    } catch (e) {
        console.error(e)
        error(500, 'Error generating response')
    }

}
