import { storiesOf } from '@storybook/react'
import React from 'react'
import DimensionsPanel from '../components/DimensionsPanel/DimensionsPanel.js'
import {
    DIMENSION_ID_DATA,
    DIMENSION_ID_ORGUNIT,
    DIMENSION_ID_PERIOD,
} from '../modules/predefinedDimensions.js'

const fixedDimensions = [
    {
        id: DIMENSION_ID_DATA,
        name: 'Data',
    },
    {
        id: DIMENSION_ID_PERIOD,
        name: 'Period',
    },
    {
        id: DIMENSION_ID_ORGUNIT,
        name: 'Organisation Unit',
    },
]

const dynamicDimensions = [
    {
        id: '0000001',
        name: 'One',
    },
    {
        id: '0000002',
        name: 'Two',
    },
    {
        id: '0000003',
        name: 'Three',
    },
]

const onDimensionClick = () => alert('click')

storiesOf('DimensionsPanel', module).add('fixed and dynamic dimensions', () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            selectedIds={[]}
        />
    )
})

storiesOf('DimensionsPanel', module).add('fixed dimensions only', () => {
    return (
        <DimensionsPanel
            dimensions={fixedDimensions}
            onDimensionClick={onDimensionClick}
            selectedIds={[]}
        />
    )
})

storiesOf('DimensionsPanel', module).add('dynamic dimensions only', () => {
    return (
        <DimensionsPanel
            dimensions={dynamicDimensions}
            onDimensionClick={onDimensionClick}
            selectedIds={[]}
        />
    )
})

storiesOf('DimensionsPanel', module).add('selected dimension', () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            selectedIds={[DIMENSION_ID_DATA]}
        />
    )
})

storiesOf('DimensionsPanel', module).add('disabled dimension', () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            disabledDimension={dimension => dimension === DIMENSION_ID_DATA}
        />
    )
})

storiesOf('DimensionsPanel', module).add('locked dimension', () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            lockedDimension={dimension => dimension === DIMENSION_ID_DATA}
        />
    )
})

storiesOf('DimensionsPanel', module).add('recommended dimension', () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            recommendedDimension={dimension => dimension === DIMENSION_ID_DATA}
        />
    )
})

storiesOf('DimensionsPanel', module).add('with menu', () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            onDimensionOptionsClick={() => alert('options click')}
        />
    )
})
