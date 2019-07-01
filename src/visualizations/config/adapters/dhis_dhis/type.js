export const VISUALIZATION_TYPE_SINGLE_VALUE = 'SINGLE_VALUE'

export default function(type) {
    switch (type) {
        case VISUALIZATION_TYPE_SINGLE_VALUE:
            return { type: VISUALIZATION_TYPE_SINGLE_VALUE }
        default:
            return { type: VISUALIZATION_TYPE_SINGLE_VALUE }
    }
}
