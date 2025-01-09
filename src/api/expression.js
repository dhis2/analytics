export const validateIndicatorExpressionMutation = {
    type: 'create',
    resource: 'indicators/expression/description',
    data: ({ expression }) => expression,
}

export const validateProgramIndicatorExpressionMutation = {
    type: 'create',
    resource: 'programIndicators/expression/description',
    data: ({ expression }) => expression,
}

export const createCalculationMutation = {
    type: 'create',
    resource: 'expressionDimensionItems',
    data: ({ name, expression }) => ({ name, shortName: name, expression }),
}

export const updateCalculationMutation = {
    type: 'json-patch',
    resource: 'expressionDimensionItems',
    id: ({ id }) => id,
    data: ({ name, expression }) => [
        { op: 'add', path: '/name', value: name },
        { op: 'add', path: '/shortName', value: name },
        { op: 'add', path: '/expression', value: expression },
    ],
}

export const deleteCalculationMutation = {
    type: 'delete',
    resource: 'expressionDimensionItems',
    id: ({ id }) => id,
}
