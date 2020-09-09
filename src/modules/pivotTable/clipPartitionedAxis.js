export const clipPartitionedAxis = ({
    partitionSize,
    partitions,
    axisMap,
    widthMap,
    viewportWidth,
    viewportPosition,
    totalWidth,
}) => {
    const partition = Math.floor(viewportPosition / partitionSize)

    if (partitions[partition] === undefined) {
        return {
            indices: [0],
            pre: 0,
            post: 0,
        }
    }

    let start = partitions[partition] - partitions[0]
    while (
        start < axisMap.length &&
        widthMap[axisMap[start]].pre < viewportPosition
    ) {
        ++start
    }
    start = start === 0 ? start : start - 1
    const pre = widthMap[axisMap[start]].pre
    const indices = []
    let end = start
    while (
        end < axisMap.length &&
        widthMap[axisMap[end]].pre < viewportPosition + viewportWidth
    ) {
        indices.push(end)
        ++end
    }
    end = end === 0 ? end : end - 1
    const post =
        totalWidth - (widthMap[axisMap[end]].pre + widthMap[axisMap[end]].width)

    return {
        indices,
        pre,
        post,
    }
}
