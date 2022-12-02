export const validateExpressionMutation = {
    type: 'create',
    resource: 'indicators/expression/description',
    data: ({ expression }) => expression,
}

export const createCalculationMutation = {
    type: 'create',
    resource: 'expressionDimensionItems',
    data: ({ name, expression }) => ({ name, expression }),
}

export const updateCalculationMutation = {
    type: 'update',
    resource: 'expressionDimensionItems',
    partial: true,
    id: ({ id }) => id,
    data: ({ name, expression }) => ({ name, expression }),
}

export const deleteCalculationMutation = {
    type: 'delete',
    resource: 'expressionDimensionItems',
    id: ({ id }) => id,
}
