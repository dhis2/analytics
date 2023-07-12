export const processTotalValue = (value, totalObj, field) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        totalObj[field] = (totalObj[field] ?? 0) + value
    }
}
