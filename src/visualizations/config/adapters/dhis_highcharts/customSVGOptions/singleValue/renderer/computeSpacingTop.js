export function computeSpacingTop(valueSpacingTop) {
    if (this.subtitle.textStr) {
        /* If a subtitle is present this will be below the title so base
         * the value X position on this */
        const subTitleRect = this.subtitle.element.getBBox()
        return subTitleRect.y + subTitleRect.height + valueSpacingTop
    } else if (this.title.textStr) {
        // Otherwise base on title
        const titleRect = this.title.element.getBBox()
        return titleRect.y + titleRect.height + valueSpacingTop
    } else {
        // If neither are present only adjust for valueSpacingTop
        return this.chartHeight - valueSpacingTop
    }
}
