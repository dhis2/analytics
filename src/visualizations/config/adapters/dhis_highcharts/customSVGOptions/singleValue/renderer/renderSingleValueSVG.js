import { addIconElement } from './addIconElement.js'
import { checkIfFitsWithinContainer } from './checkIfFitsWithinContainer.js'
import { getAvailableSpace } from './getAvailableSpace.js'
import { positionElements } from './positionElements.js'
import { DynamicStyles } from './styles.js'

export function renderSingleValueSVG() {
    const color = this.title.styles.color
    const { /* dashboard, */ formattedValue, icon, subText } =
        this.userOptions.customSVGOptions
    const dynamicStyles = new DynamicStyles()
    const valueElement = this.renderer
        .text(formattedValue)
        .css({ color, visibility: 'hidden' })
        .add()
    const subTextElement = subText
        ? this.renderer.text(subText).css({ color, visibility: 'hidden' }).add()
        : null
    const iconElement = icon ? addIconElement.call(this, icon, color) : null

    let fitsWithinContainer = false
    let styles = {}

    while (!fitsWithinContainer && dynamicStyles.hasNext()) {
        styles = dynamicStyles.next()

        valueElement.css(styles.value)
        subTextElement?.css(styles.subText)

        fitsWithinContainer = checkIfFitsWithinContainer(
            getAvailableSpace.call(this, styles.spacing.valueTop),
            valueElement,
            subTextElement,
            icon,
            subText,
            styles.spacing
        )
    }

    positionElements.call(
        this,
        valueElement,
        subTextElement,
        iconElement,
        styles.spacing
    )

    valueElement.css({ visibility: 'visible' })
    iconElement?.css({ visibility: 'visible' })
    subTextElement?.css({ visibility: 'visible' })
}