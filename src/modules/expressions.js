import i18n from '../locales/index.js'

export const VALID_EXPRESSION = 'OK'
export const INVALID_EXPRESSION = 'ERROR'

export const parseExpression = (input) => {
    const regex = /(#{[a-zA-Z0-9#]+.*?}|[+\-*/()])|(\d+)/g
    return input.match(regex) || []
}

// input: '#{abc123}/10'
// output: [{label:'abc123', value:'#{abc123}'},{label:'/', value:'/'},{label:'10', value:'10'}]
export const parseExpressionToArray = (input = '') => {
    return (
        parseExpression(input).map((part) => {
            if (part.startsWith('#{') && part.endsWith('}')) {
                const id = part.slice(2, -1)
                return { value: part, label: id }
            }
            return { value: part, label: part }
        }) || []
    )
}

// input: [{label:'abc123', value:'#{abc123}'},{label:'/', value:'/'},{label:'10', value:'10'}]
// output: '#{abc123}/10'
export const parseArrayToExpression = (input = []) =>
    input.map((item) => item.value).join('')

export const validateExpression = async (expression) => {
    let result = ''
    // TODO: two numbers next to each other

    const leftParenthesisCount = expression.split('(').length - 1
    const rightParenthesisCount = expression.split(')').length - 1

    if (!expression) {
        // empty formula
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Empty formula'),
        }
    } else if (/[-+/*]{2,}/.test(expression)) {
        // two math operators next to each other
        result = {
            status: INVALID_EXPRESSION,
            message: i18n.t('Consecutive math operators'),
        }
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
