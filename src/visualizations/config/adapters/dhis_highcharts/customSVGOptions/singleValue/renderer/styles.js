const baseStyle = {
    value: {
        fontWeight: 300,
    },
    subText: {},
}

const valueStyles = [
    { fontSize: 200, letterSpacing: -6 },
    { fontSize: 182, letterSpacing: -5.5 },
    { fontSize: 164, letterSpacing: -5 },
    { fontSize: 146, letterSpacing: -4.5 },
    { fontSize: 128, letterSpacing: -4 },
    { fontSize: 110, letterSpacing: -3.5 },
    { fontSize: 92, letterSpacing: -3 },
    { fontSize: 74, letterSpacing: -2.5 },
    { fontSize: 56, letterSpacing: -2 },
    { fontSize: 38, letterSpacing: -1.5 },
    { fontSize: 20, letterSpacing: -1 },
]

const subTextStyles = [
    { fontSize: 100, letterSpacing: -3 },
    { fontSize: 91, letterSpacing: -2.7 },
    { fontSize: 82, letterSpacing: -2.4 },
    { fontSize: 73, letterSpacing: -2.1 },
    { fontSize: 64, letterSpacing: -1.8 },
    { fontSize: 55, letterSpacing: -1.5 },
    { fontSize: 46, letterSpacing: -1.2 },
    { fontSize: 37, letterSpacing: -0.9 },
    { fontSize: 28, letterSpacing: -0.6 },
    { fontSize: 19, letterSpacing: 0.3 },
    { fontSize: 10, letterSpacing: 0 },
]

const spacings = [
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 140 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 127 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 115 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 102 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 90 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 77 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 64 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 52 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 39 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 27 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 14 },
]

export const MIN_SIDE_WHITESPACE = 4

export class DynamicStyles {
    constructor() {
        this.currentIndex = 0
    }
    getStyle() {
        return {
            value: { ...baseStyle.value, ...valueStyles[this.currentIndex] },
            subText: {
                ...baseStyle.subText,
                ...subTextStyles[this.currentIndex],
            },
            spacing: spacings[this.currentIndex],
        }
    }
    next() {
        if (this.currentIndex === valueStyles.length - 1) {
            throw new Error('No next available, already on the smallest style')
        } else {
            ++this.currentIndex
        }

        return this.getStyle()
    }
    first() {
        this.currentIndex = 0

        return this.getStyle()
    }
    hasNext() {
        return this.currentIndex < valueStyles.length - 1
    }
}
