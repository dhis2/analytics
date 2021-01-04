import regression from 'regression'

export const getRegression = (data, type = 'linear') => {
    switch (type) {
        case 'linear':
        default:
            return regression.linear(data)
    }
}
