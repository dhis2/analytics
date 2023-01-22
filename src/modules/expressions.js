export const parseExpression = (input) => {
    const regex = /(#{[a-zA-Z0-9#]+.*?}|[+\-*/()])|(\d+)/g
    return input.match(regex) || []
}
