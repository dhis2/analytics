export const BOLD = 'bold'
export const ITALIC = 'italic'
export const LINK = 'link'
export const MENTION = 'mention'
export const EMOJI_SMILEY_FACE = 'smileyFace'
export const EMOJI_SAD_FACE = 'sadFace'
export const EMOJI_THUMBS_UP = 'thumbsUp'
export const EMOJI_THUMBS_DOWN = 'thumsDown'

export const emojis = {
    [EMOJI_SMILEY_FACE]: ':-)',
    [EMOJI_SAD_FACE]: ':-(',
    [EMOJI_THUMBS_UP]: ':+1',
    [EMOJI_THUMBS_DOWN]: ':-1',
}

const markdownMap = {
    [ITALIC]: {
        prefix: '_',
        postfix: '_',
    },
    [BOLD]: {
        prefix: '*',
        postfix: '*',
    },
    [LINK]: {
        prefix: '[',
        postfix: '](https://link-url)',
    },
    [MENTION]: {
        prefix: '@',
    },
    [EMOJI_SMILEY_FACE]: {
        prefix: emojis[EMOJI_SMILEY_FACE],
    },
    [EMOJI_SAD_FACE]: {
        prefix: emojis[EMOJI_SAD_FACE],
    },
    [EMOJI_THUMBS_UP]: {
        prefix: emojis[EMOJI_THUMBS_UP],
    },
    [EMOJI_THUMBS_DOWN]: {
        prefix: emojis[EMOJI_THUMBS_DOWN],
    },
}

const trim = (str) => {
    const leftSpaces = /^\s+/
    const rightSpaces = /\s+$/

    return str.replace(leftSpaces, '').replace(rightSpaces, '')
}

export const insertMarkdown = (markdown, target, cb) => {
    const { selectionStart: start, selectionEnd: end, value } = target
    const marker = markdownMap[markdown] || null
    if (!marker || !cb || start < 0) {
        return
    }

    let newValue
    let caretPos = end + 1

    const padMarkers = (text) => {
        // is caret between two markers (i.e., "**" or "__")? Then do not add padding
        if (start === end && value.length && start > 0) {
            if (
                (value[start - 1] === markdownMap[BOLD].prefix &&
                    value[start] === markdownMap[BOLD].prefix) ||
                (value[start - 1] === markdownMap[ITALIC].prefix &&
                    value[start] === markdownMap[ITALIC].prefix)
            ) {
                return text
            }
        }

        if (value.length && start > 0 && value[start - 1] !== ' ') {
            text = ` ${text}`
            ++caretPos
        }

        if (value.length && end !== value.length && value[end] !== ' ') {
            text = `${text} `
        }

        return text
    }

    if (start === end) {
        //no text
        const valueArr = value.split('')
        let markdownString = marker.prefix

        if (marker.postfix) {
            markdownString += marker.postfix
        }

        valueArr.splice(start, 0, padMarkers(markdownString))
        newValue = valueArr.join('')

        // for smileys, put the caret after a space
        if (Object.keys(emojis).includes(markdown)) {
            newValue += ' '
            caretPos = caretPos + newValue.length - 1
        }
    } else {
        const text = value.slice(start, end)
        const trimmedText = trim(text) // TODO really needed?

        // adjust caretPos based on trimmed text selection
        caretPos = caretPos - (text.length - trimmedText.length) + 1

        let markdownString = `${marker.prefix}${trimmedText}`

        if (marker.postfix) {
            markdownString += marker.postfix
        }

        newValue = [
            value.slice(0, start),
            padMarkers(markdownString),
            value.slice(end),
        ].join('')
    }

    cb(newValue, caretPos)
}

export const convertCtrlKey = (event, cb) => {
    const { key, ctrlKey, metaKey } = event

    if (key === 'b' && (ctrlKey || metaKey)) {
        event.preventDefault()
        insertMarkdown(BOLD, event.target, cb)
    } else if (key === 'i' && (ctrlKey || metaKey)) {
        event.preventDefault()
        insertMarkdown(ITALIC, event.target, cb)
    }
}
