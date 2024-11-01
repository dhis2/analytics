export const addToTotalIfNumber = (value, total) =>
    typeof value === 'number' && Number.isFinite(value)
        ? (total ?? 0) + value
        : total
