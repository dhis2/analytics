import React from 'react'

export const PivotTableClippedAxis = ({
    axisClippingResult,
    EmptyComponent,
    renderItem,
}) => [
    axisClippingResult.pre ? (
        <EmptyComponent size={axisClippingResult.pre} />
    ) : null,
    axisClippingResult.indices.map(renderItem),
    axisClippingResult.post ? (
        <EmptyComponent size={axisClippingResult.post} />
    ) : null,
]
