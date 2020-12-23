import regression from 'regression'
import { getSortedData } from './getSortedData'

export const getRegression = (data, type = 'linear') => {
    switch (type) {
        case 'linear':
        default:
            return regression.linear(getSortedData(data))
    }
}