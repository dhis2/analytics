let canvas

const getContext = fontSize => {
    if (!canvas) {
        canvas = document.createElement('canvas')
    }

    const ctx = canvas.getContext('2d')
    ctx.font = `${fontSize}px Roboto, Arial, sans-serif`

    return ctx
}

export const measureText = (text, fontSize = 11) => {
    const ctx = getContext(fontSize)

    const textMetrics = ctx.measureText(text)
    return textMetrics.width
}
