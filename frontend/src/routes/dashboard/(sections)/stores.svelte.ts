import { getContext, hasContext, setContext } from 'svelte'

interface StateInterface {
    current: 'projects' | 'editor' | null
}


export const pageStateStore = (
    context: string = '_pageState'
): {
    current: 'projects' | 'editor' | null
    set: (state: 'projects' | 'editor' | null) => void
} => {
    if (hasContext(context)) {
        return getContext(context)
    }

    // this is the state of the store
    const _state: StateInterface = $state({
        current: 'projects'
    })

    // this is the rune that is returned and can be used to interact with the store
    const _rune = {
        get current() {
            return _state.current
        },
        set: (state: 'projects' | 'editor' | null) => {
            _state.current = state
        }
    }

    setContext(context, _rune)
    return _rune
}


interface SelectionInterface {
    name: string
    files: string[]
    selectedFile: string
}

export const projectSelectionStore = (
    context: string = '_projectSelection'
): {
    current: SelectionInterface | null
    set: (state: SelectionInterface | null) => void
} => {
    if (hasContext(context)) {
        return getContext(context)
    }

    let _state: SelectionInterface | null = $state({
        name: '',
        files: [],
        selectedFile: ''
    })

    const _rune = {
        get current() {
            return _state
        },
        set: (state: SelectionInterface | null) => {
            _state = state
        }
    }

    setContext(context, _rune)
    return _rune
}

interface AdditionalContextInterface {
    text: string
    replacementText: string
}

export const additionalContextStore = (
    context: string = '_additionalContext'
): {
    text: string | null
    replacementText: string | null
    set: (state: string | null) => void
    replace: (state: string | null) => void
} => {
    if (hasContext(context)) {
        return getContext(context)
    }

    const _state: AdditionalContextInterface | null = $state({
        text: '',
        replacementText: ''
    })

    const _rune = {
        get text() {
            return _state?.text
        },
        get replacementText() {
            return _state?.replacementText
        },
        set: (state: string | null) => {
            _state.text = state as string
        },
        replace: (state: string | null) => {
            _state.replacementText = state as string
        }
    }

    setContext(context, _rune)
    return _rune
}


