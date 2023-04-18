import i18n from '../locales/index.js'

export const EXPRESSION_TYPE_NUMBER = 'EXPRESSION_TYPE_NUMBER'
export const EXPRESSION_TYPE_OPERATOR = 'EXPRESSION_TYPE_OPERATOR'
export const EXPRESSION_TYPE_DATA = 'EXPRESSION_TYPE_DATA'

export const VALID_EXPRESSION = 'OK'
export const INVALID_EXPRESSION = 'ERROR'

export const getOperators = () => [
    { value: '+', label: '+', type: EXPRESSION_TYPE_OPERATOR },
    { value: '-', label: '-', type: EXPRESSION_TYPE_OPERATOR },
    { value: '*', label: '×', type: EXPRESSION_TYPE_OPERATOR },
    { value: '/', label: '/', type: EXPRESSION_TYPE_OPERATOR },
    { value: '(', label: '(', type: EXPRESSION_TYPE_OPERATOR },
    { value: ')', label: ')', type: EXPRESSION_TYPE_OPERATOR },
    {
        value: '',
        label: i18n.t('Number'),
        type: EXPRESSION_TYPE_NUMBER,
    },
]

export const parseExpression = (input) => {
    const regex = /(#{[a-zA-Z0-9#.]+}|[+\-*/()])|(\d+(\.\d+)?)/g
    return input.match(regex) || []
}

export const parseExpressionToArray = (expression = '', metadata = []) => {
    return (
        parseExpression(expression).map((value) => {
            if (value.startsWith('#{') && value.endsWith('}')) {
                const id = value.slice(2, -1)
                const label =
                    metadata.find((item) => item.id === id)?.name || id
                return { value, label, type: EXPRESSION_TYPE_DATA }
            }

            if (isNaN(value)) {
                return {
                    value,
                    label: getOperators().find((op) => op.value === value)
                        .label,
                    type: EXPRESSION_TYPE_OPERATOR,
                }
            }

            return {
                value,
                label: value,
                type: EXPRESSION_TYPE_NUMBER,
            }
        }) || []
    )
}

export const parseArrayToExpression = (input = []) =>
    input.map((item) => item.value).join('')

export const validateExpression = (expression) => {
    let result
    const leftParenthesisCount = expression.split('(').length - 1
    const rightParenthesisCount = expression.split(')').length - 1

    if (!expression) {
        // empty formula
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t(
                'Formula is empty. Add items to the formula from the lists on the left.'
            ),
        }
        // TODO: reimplement this but allow negative values, e.g. 10 / -5
        // } else if (/[-+/*]{2,}/.test(expression)) {
        //     // two math operators next to each other
        //     result = {
        //         status: INVALID_EXPRESSION,
        //         message: i18n.t('Consecutive math operators'),
        //     }
    } else if (/}#/.test(expression)) {
        // two data elements next to each other
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Consecutive data elements'),
        }
    } else if (/^[+\-*/]|[+\-*/]$/.test(expression)) {
        // starting or ending with a math operator
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Starts or ends with a math operator'),
        }
    } else if (/\(\)/.test(expression)) {
        // contains an empty set of parentheses
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Empty parentheses'),
        }
    } else if (leftParenthesisCount > rightParenthesisCount) {
        // ( but no )
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Missing right parenthesis )'),
        }
    } else if (rightParenthesisCount > leftParenthesisCount) {
        // ) but no (
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Missing left parenthesis ('),
        }
    }

    return result
}

export const getItemIdsFromExpression = (expression = '') => {
    const regex = /#{([a-zA-Z0-9#]+.*?)}/g
    const matches = expression.match(regex)
    return matches ? matches.map((match) => match.slice(2, -1)) : []
}
