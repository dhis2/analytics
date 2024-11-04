import i18n from '@dhis2/d2-i18n'

export const formatList = (items) => {
    // Wrap Intl.ListFormat in try/catch as DHIS2 locales are not always ISO 639 compliant
    try {
        const formatter = new Intl.ListFormat(i18n.language, {
            style: 'long',
            type: 'conjunction',
        })
        return formatter.format(items)
    } catch (error) {
        return items.join(', ')
    }
}
