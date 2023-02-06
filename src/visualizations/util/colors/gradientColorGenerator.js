export const generateColors = (start, end, steps) => {
    if (!end || !steps || steps < 2) {
        return [start]
    }
    const stepFactor = 1 / (steps - 1),
        result = []

    for (let step = 0; step < steps; step++) {
        const color1 = convertHexToRGB(start),
            color2 = convertHexToRGB(end),
            factor = stepFactor * step

        const rgbArray = color1.slice()
        rgbArray.forEach(
            (part, index, array) =>
                (array[index] = Math.round(
                    part + factor * (color2[index] - color1[index])
                ))
        )
        result.push(convertRGBToHex(rgbArray))
    }

    return result
}

const convertRGBToHex = (rgb) =>
    '#' +
    ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1)

const convertHexToRGB = (hex) =>
    hex
        .replace(/^#/, '')
        .match(/.{1,2}/g)
        .map((val) => parseInt(val, 16))
