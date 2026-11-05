// Data sets for a test data element, one per period type: `${periodType}Form`
export const inDataSets = (periodTypes) =>
    periodTypes.map((periodType) => ({ id: `${periodType}Form`, periodType }))
