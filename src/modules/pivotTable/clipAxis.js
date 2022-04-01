import times from 'lodash/times'

export const clipAxis = ({ position, size, step, totalCount, headerCount }) => {
    // position: scroll Y position
    // size: height of table container
    // step: height of cell in px
    // totalCount: number of rows
    // headerCount: number of header rows (plus 1 for title plus 1 for subtitle)

    // height in px of all row headers section, including title and subtitle when not using
    // fixed column headers
    const floor = headerCount * step
    // offset in px for the clipping content
    const offset = position < floor ? floor - position : 0

    const count = Math.min(totalCount, Math.ceil((size - offset) / step) + 1)
    position = Math.max(0, position - floor)
    const start = Math.min(totalCount - count, Math.floor(position / step))
    const pre = Math.max(start * step, 0)
    const post = (totalCount - (start + count)) * step
    const indices = times(count, (n) => start + n)

    return {
        indices,
        pre,
        post,
    }
}
