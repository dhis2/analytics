const valueStyles = [
    { 'font-size': '164px', 'letter-spacing': '-5px' },
    { 'font-size': '128px', 'letter-spacing': '-4px' },
    { 'font-size': '96px', 'letter-spacing': '-3px' },
    { 'font-size': '64px', 'letter-spacing': '-2.5px' },
    { 'font-size': '40px', 'letter-spacing': '-1.5px' },
    { 'font-size': '20px', 'letter-spacing': '-1px' },
]

const subTextStyles = [
    { 'font-size': '36px', 'letter-spacing': '-1.4px' },
    { 'font-size': '32px', 'letter-spacing': '-1.2px' },
    { 'font-size': '26px', 'letter-spacing': '-0.8px' },
    { 'font-size': '20px', 'letter-spacing': '-0.6px' },
    { 'font-size': '14px', 'letter-spacing': '0.2px' },
    { 'font-size': '9px', 'letter-spacing': '0px' },
]

const spacings = [
    { valueTop: 8, subTextTop: 12, iconGap: 8, iconSize: 164 },
    { valueTop: 8, subTextTop: 12, iconGap: 6, iconSize: 128 },
    { valueTop: 8, subTextTop: 8, iconGap: 4, iconSize: 96 },
    { valueTop: 8, subTextTop: 8, iconGap: 4, iconSize: 64 },
    { valueTop: 8, subTextTop: 8, iconGap: 4, iconSize: 40 },
    { valueTop: 8, subTextTop: 4, iconGap: 2, iconSize: 20 },
]

export const MIN_SIDE_WHITESPACE = 4

export class DynamicStyles {
    constructor() {
        this.currentIndex = 0
    }
    getStyle() {
        return {
            value: {
                ...valueStyles[this.currentIndex],
                'font-weight': '300',
            },
            subText: subTextStyles[this.currentIndex],
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
