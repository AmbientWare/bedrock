export interface Project {
    name: string
    files: string[]
}

export interface Message {
    role: 'user' | 'assistant'
    content: string
    extraContent?: string | null
}

export interface Section {
    id: string
    name: string | null
    description: string | number | string[] | null
}

export interface SummaryTemplate {
    name: string
    summaries: Summary[]
}

export interface Summary {
    id: string
    name: string | null
    sections: Section[]
}

export interface NewProjectData {
    id: string
    name: string | null
    files: string[] | null
    summaries: Summary[]
}
