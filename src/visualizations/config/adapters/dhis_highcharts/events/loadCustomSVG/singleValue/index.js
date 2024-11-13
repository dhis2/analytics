import { addIconElement } from './addIconElement.js'
import { checkIfFitsWithinContainer } from './checkIfFitsWithinContainer.js'
import { getAvailableSpace } from './getAvailableSpace.js'
import { positionElements } from './positionElements.js'
import { DynamicStyles } from './styles.js'

export default function loadSingleValueSVG() {
    const { formattedValue, icon, subText, fontColor } =
        this.userOptions.customSVGOptions
    const dynamicStyles = new DynamicStyles()
    const valueElement = this.renderer
        .text(formattedValue)
        .attr('data-test', 'visualization-primary-value')
        .css({ color: fontColor, visibility: 'hidden' })
        .add()
    const subTextElement = subText
        ? this.renderer
              .text(subText)
              .attr('data-test', 'visualization-subtext')
              .css({ color: fontColor, visibility: 'hidden' })
              .add()
        : null
    const iconElement = icon ? addIconElement.call(this, icon, fontColor) : null

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
