import PropTypes from 'prop-types'
import React from 'react'

export const PivotTableClippedAxis = ({
    axisClippingResult,
    EmptyComponent,
    ItemComponent,
}) => [
    axisClippingResult.pre ? (
        <EmptyComponent key="pre" size={axisClippingResult.pre} />
    ) : null,
    axisClippingResult.indices.map((index) => (
        <ItemComponent key={index} index={index} />
    )),
    axisClippingResult.post ? (
        <EmptyComponent key="post" size={axisClippingResult.post} />
    ) : null,
]

PivotTableClippedAxis.propTypes = {
    axisClippingResult: PropTypes.object.isRequired,
    EmptyComponent: PropTypes.func,
    ItemComponent: PropTypes.func,
}
