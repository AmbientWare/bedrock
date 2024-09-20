export interface Project {
    name: string
    files: string[]
}

export interface Message {
    role: 'user' | 'assistant'
    content: string
}
