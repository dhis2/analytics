const calculateColorBrightness = function(rgb) {
    return Math.round(
        (parseInt(rgb[0]) * 299 +
            parseInt(rgb[1]) * 587 +
            parseInt(rgb[2]) * 114) /
            1000
    )
}

const isHex = color => {
    return typeof color === 'string' && color.charAt(0) === '#'
}

const hexToRgb = hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

    return result
        ? [
              parseInt(result[1], 16),
              parseInt(result[2], 16),
              parseInt(result[3], 16),
          ]
        : null
}

export const isColorBright = color => {
    if (isHex(color)) {
        color = hexToRgb(color)
    }

    return calculateColorBrightness(color) > 125
}
