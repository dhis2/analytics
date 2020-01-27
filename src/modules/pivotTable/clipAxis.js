import times from 'lodash/times'

export const clipAxis = ({ position, size, step, totalCount, headerCount }) => {
    position = Math.max(0, position - headerCount * step) // TODO: Support sticky headers
    const count = Math.min(totalCount, Math.ceil(size / step) + 1)
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
