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
        name: 'Dietary diversity score based on variety of consumed food groups over a weekly period',
    },
    {
        id: '0000002',
        name: 'Healthcare services access and utilization frequency including preventive check-ups and specialist care',
    },
    {
        id: '0000003',
        name: 'Sleep quality index incorporating duration, time to sleep, frequency of awakenings, and restfulness',
    },
    {
        id: '0000004',
        name: 'Malaria incidence rate',
    },
]

const onDimensionClick = () => alert('click')

export default {
    title: 'DimensionsPanel',
}

export const FixedAndDynamicDimensions = () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            selectedIds={[]}
        />
    )
}

FixedAndDynamicDimensions.story = {
    name: 'fixed and dynamic dimensions',
}

export const FixedDimensionsOnly = () => {
    return (
        <DimensionsPanel
            dimensions={fixedDimensions}
            onDimensionClick={onDimensionClick}
            selectedIds={[]}
        />
    )
}

FixedDimensionsOnly.story = {
    name: 'fixed dimensions only',
}

export const DynamicDimensionsOnly = () => {
    return (
        <DimensionsPanel
            dimensions={dynamicDimensions}
            onDimensionClick={onDimensionClick}
            selectedIds={[]}
        />
    )
}

DynamicDimensionsOnly.story = {
    name: 'dynamic dimensions only',
}

export const SelectedDimension = () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            selectedIds={[DIMENSION_ID_DATA]}
        />
    )
}

SelectedDimension.story = {
    name: 'selected dimension',
}

export const DisabledDimension = () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            disabledDimension={(dimension) => dimension === DIMENSION_ID_DATA}
        />
    )
}

DisabledDimension.story = {
    name: 'disabled dimension',
}

export const LockedDimension = () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            selectedIds={[DIMENSION_ID_DATA]}
            lockedDimension={(dimension) => dimension === DIMENSION_ID_DATA}
        />
    )
}

LockedDimension.story = {
    name: 'locked dimension',
}

export const RecommendedDimension = () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            recommendedDimension={(dimension) =>
                dimension === DIMENSION_ID_DATA
            }
        />
    )
}

RecommendedDimension.story = {
    name: 'recommended dimension',
}

export const WithMenu = () => {
    return (
        <DimensionsPanel
            dimensions={[...fixedDimensions, ...dynamicDimensions]}
            onDimensionClick={onDimensionClick}
            onDimensionOptionsClick={() => alert('options click')}
        />
    )
}

WithMenu.story = {
    name: 'with menu',
}

export const TextWrapping = () => {
    return (
        <div
            style={{
                width: '260px',
                height: '400px',
                borderInlineEnd: '1px dotted #CCC',
                resize: 'both',
                overflow: 'auto',
            }}
        >
            <DimensionsPanel
                dimensions={[...fixedDimensions, ...dynamicDimensions]}
                onDimensionClick={onDimensionClick}
                onDimensionOptionsClick={() => alert('options click')}
                recommendedDimension={(dimension) => dimension === '0000002'}
                lockedDimension={(dimension) => dimension === '0000003'}
                selectedIds={['0000003', '0000002']}
            />
        </div>
    )
}

TextWrapping.story = {
    name: 'text wrapping',
}
