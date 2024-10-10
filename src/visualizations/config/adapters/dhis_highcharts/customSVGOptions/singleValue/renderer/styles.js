const valueStyles = [
    { 'font-size': '200px', 'letter-spacing': '-6px' },
    { 'font-size': '182px', 'letter-spacing': '-5.5px' },
    { 'font-size': '164px', 'letter-spacing': '-5px' },
    { 'font-size': '146px', 'letter-spacing': '-4.5px' },
    { 'font-size': '128px', 'letter-spacing': '-4px' },
    { 'font-size': '110px', 'letter-spacing': '-3.5px' },
    { 'font-size': '92px', 'letter-spacing': '-3px' },
    { 'font-size': '74px', 'letter-spacing': '-2.5px' },
    { 'font-size': '56px', 'letter-spacing': '-2px' },
    { 'font-size': '38px', 'letter-spacing': '-1.5px' },
    { 'font-size': '20px', 'letter-spacing': '-1px' },
]

const subTextStyles = [
    { 'font-size': '67px', 'letter-spacing': '-2px' },
    { 'font-size': '61px', 'letter-spacing': '-1.8px' },
    { 'font-size': '55px', 'letter-spacing': '-1.6px' },
    { 'font-size': '49px', 'letter-spacing': '-1.4px' },
    { 'font-size': '43px', 'letter-spacing': '-1.2px' },
    { 'font-size': '37px', 'letter-spacing': '-1px' },
    { 'font-size': '31px', 'letter-spacing': '-0.8px' },
    { 'font-size': '25px', 'letter-spacing': '-0.6px' },
    { 'font-size': '19px', 'letter-spacing': '-0.4px' },
    { 'font-size': '13px', 'letter-spacing': '0.2px' },
    { 'font-size': '7px', 'letter-spacing': '0px' },
]

const spacings = [
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 200 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 182 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 164 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 146 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 128 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 110 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 92 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 74 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 56 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 38 },
    { valueTop: 8, subTextTop: 4, iconGap: 4, iconSize: 20 },
]

export const MIN_SIDE_WHITESPACE = 4

export class DynamicStyles {
    constructor(isExportingToPDF) {
        this.currentIndex = 0
        this.isExportingToPDF = isExportingToPDF
    }
    getStyle() {
        return {
            value: {
                ...valueStyles[this.currentIndex],
                'font-weight': this.isExportingToPDF ? 'normal' : '300',
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
