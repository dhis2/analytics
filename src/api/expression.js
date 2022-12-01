import { onError } from './index.js'

const expressionValidationMutation = {
    resource: 'indicators/expression/description',
    data: ({ expression }) => expression,
    type: 'create',
}

export const createCalculationMutation = {
    type: 'create',
    resource: 'expressionDimensionItems',
    data: ({ name, expression }) => ({ name, expression }),
}

export const updateCalculationMutation = {
    type: 'update',
    partial: true,
    resource: 'expressionDimensionItems',
    id: ({ id }) => id,
    data: ({ name, expression }) => ({ name, expression }),
}

export const apiValidateExpression = async (dataEngine, expression) => {
    const validationData = dataEngine.mutate(expressionValidationMutation, {
        variables: { expression },
        onError,
    })

    return validationData
}

export const apiSaveExpressionDimensionItem = (
    dataEngine,
    expressionDimensionItem
) => {
    const mutation = {
        type: 'create',
        resource: 'expressionDimensionItems',
        data: expressionDimensionItem,
    }

    if (expressionDimensionItem.id) {
        mutation.type = 'update'
        mutation.id = expressionDimensionItem.id
    }

    return dataEngine.mutate(mutation)
}
