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
