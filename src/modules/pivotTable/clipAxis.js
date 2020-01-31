import times from 'lodash/times'

export const clipAxis = ({ position, size, step, totalCount, headerCount }) => {
    const floor = headerCount * step
    const offset = position < floor ? floor - position : 0

    const count = Math.min(totalCount, Math.ceil((size - offset) / step) + 1)
    position = Math.max(0, position - floor) // TODO: Support sticky headers
    const start = Math.min(totalCount - count, Math.floor(position / step))
    const pre = Math.max(start * step, 0)
    const post = (totalCount - (start + count)) * step
    const indices = times(count, n => start + n)

    return {
        indices,
        pre,
        post,
    }
}
