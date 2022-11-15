import { onError } from './index.js'

const indicatorExpressionValidationMutation = {
    resource: 'indicators/expression/description',
    data: ({ expression }) => expression,
    type: 'create',
}

export const apiValidateIndicatorExpression = async (
    dataEngine,
    expression
) => {
    const validationData = dataEngine.mutate(
        indicatorExpressionValidationMutation,
        { variables: { expression }, onError }
    )

    return validationData
}
