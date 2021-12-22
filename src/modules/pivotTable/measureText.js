import {
    CLIPPED_CELL_MAX_SIZE,
    WRAPPED_TEXT_JUSTIFY_BUFFER,
    WRAPPED_TEXT_LINE_HEIGHT,
} from './pivotTableConstants.js'

let canvas

const getContext = fontSize => {
    if (!canvas) {
        canvas = document.createElement('canvas')
    }

    const ctx = canvas.getContext('2d')
    ctx.font = `${fontSize}px Roboto, Arial, sans-serif`

    return ctx
}

const measureText = (text, fontSize = 11) => {
    const ctx = getContext(fontSize)

    const textMetrics = ctx.measureText(text)
    return textMetrics.width
}

export const measureTextWithWrapping = (
    text,
    {
        fontSize = 11,
        maxWidth = CLIPPED_CELL_MAX_SIZE,
        justifyBuffer = WRAPPED_TEXT_JUSTIFY_BUFFER,
        lineHeight = WRAPPED_TEXT_LINE_HEIGHT,
    }
) => {
    if (!text) {
        return { width: 0, height: 0 }
    }
    // Multiple consecutive linebreaks are combined into one
    const paragraphs = String(text).split(/\n/)

    const lines = []
    let currentLine = ''
    let currentLineWidth = 0
    let maxLineWidth = 0
    while (paragraphs.length) {
        // Currently, all different whitespace types are ignored and assumed to be just a space
        const words = paragraphs.shift().split(/\s+/)
        while (words.length) {
            const nextWord = (currentLineWidth === 0 ? '' : ' ') + words.shift()
            const nextWordWidth = measureText(nextWord, fontSize)
            if (maxWidth && currentLineWidth + nextWordWidth > maxWidth) {
                if (currentLineWidth <= maxWidth - justifyBuffer) {
                    // Wrapping this word would cause an unnaturally short line
                    // For now we allow the cell to expand to fit this word
                    // In the future, we might intelligently hyphenate the word
                    // TODO: if splitting words how would we localize hyphens?
                    // Do nothing, keep the word on this line
                } else {
                    maxLineWidth = Math.max(currentLineWidth, maxLineWidth)
                    lines.push(currentLine)
                    currentLine = ''
                    currentLineWidth = 0

                    words.unshift(nextWord.substring(1)) // Get rid of the extra space
                    continue
                }
            }
            currentLine += nextWord
            currentLineWidth += nextWordWidth
        }
        if (currentLineWidth > 0) {
            maxLineWidth = Math.max(currentLineWidth, maxLineWidth)
            lines.push(currentLine)
        }
    }

    return {
        normalizedText: lines.join('\n'),
        width: maxLineWidth,
        height: lines.length * fontSize * lineHeight, // TODO: use lineHeight=1 for last line?
    }
}
