import { DataProvider } from '@dhis2/app-runtime'
import React, { useState } from 'react'
import OrgUnitDimension from '../components/OrgUnitDimension/OrgUnitDimension.js'

const Wrapper = (story) => (
    <DataProvider
        baseUrl="https://test.e2e.dhis2.org/analytics-41dev/"
        apiVersion="41"
    >
        {story()}
    </DataProvider>
)

const defaultRootOrgUnits = ['ImspTQPwCqd'] // Sierra Leone

export default {
    title: 'OrgUnitDimension',
    decorators: [Wrapper],
}

export const NoneSelected = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

NoneSelected.story = {
    name: 'None selected',
}

export const RootSelected = () => {
    const [selected, setSelected] = useState([
        {
            id: 'ImspTQPwCqd',
            path: '/ImspTQPwCqd',
            name: 'Sierra Leone',
        },
    ])

    return (
        <OrgUnitDimension
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

RootSelected.story = {
    name: 'Root selected',
}

export const SingleLevel2ChildSelected = () => {
    const [selected, setSelected] = useState([
        {
            id: 'fdc6uOvgoji',
            path: '/ImspTQPwCqd/fdc6uOvgoji',
            name: 'Bombali',
        },
    ])

    return (
        <OrgUnitDimension
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

SingleLevel2ChildSelected.story = {
    name: 'Single level 2 child selected',
}

export const MultipleLevel2ChildrenSelected = () => {
    const [selected, setSelected] = useState([
        { id: 'O6uvpzGd5pu', path: '/ImspTQPwCqd/O6uvpzGd5pu', name: 'Bo' },
        {
            id: 'fdc6uOvgoji',
            path: '/ImspTQPwCqd/fdc6uOvgoji',
            name: 'Bombali',
        },
        {
            id: 'lc3eMKXaEfw',
            path: '/ImspTQPwCqd/lc3eMKXaEfw',
            name: 'Bonthe',
        },
    ])

    return (
        <OrgUnitDimension
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

MultipleLevel2ChildrenSelected.story = {
    name: 'Multiple level 2 children selected',
}

export const MultipleSelectedAcrossDifferentLevels = () => {
    const [selected, setSelected] = useState([
        {
            id: 'fdc6uOvgoji',
            path: '/ImspTQPwCqd/fdc6uOvgoji',
            name: 'Bombali',
        },
        {
            id: 'KKkLOTpMXGV',
            path: '/ImspTQPwCqd/fdc6uOvgoji/KKkLOTpMXGV',
            name: 'Bombali Sebora',
        },
        {
            id: 'GQcsUZf81vP',
            path: '/ImspTQPwCqd/fdc6uOvgoji/KKkLOTpMXGV/GQcsUZf81vP',
            name: 'Govt. Hosp. Makeni',
        },
    ])

    return (
        <OrgUnitDimension
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

MultipleSelectedAcrossDifferentLevels.story = {
    name: 'Multiple selected across different levels',
}

export const MultipleRoots = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={['O6uvpzGd5pu', 'fdc6uOvgoji']} // Bo + Bombali
        />
    )
}

MultipleRoots.story = {
    name: 'Multiple roots',
}

export const WithoutUserOrgUnitsSelection = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            hideUserOrgUnits={true}
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

WithoutUserOrgUnitsSelection.story = {
    name: 'Without user org units selection',
}

export const WithoutLevelSelector = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            hideLevelSelect={true}
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

WithoutLevelSelector.story = {
    name: 'Without level selector',
}

export const WithoutGroupSelector = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            hideGroupSelect={true}
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

WithoutGroupSelector.story = {
    name: 'Without group selector',
}

export const WithoutLevelAndGroupSelector = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            hideLevelSelect={true}
            hideGroupSelect={true}
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
        />
    )
}

WithoutLevelAndGroupSelector.story = {
    name: 'Without level and group selector',
}

export const WithoutLevelAndGroupSelectorWithWarningText = () => {
    const [selected, setSelected] = useState([])

    return (
        <OrgUnitDimension
            hideLevelSelect={true}
            hideGroupSelect={true}
            selected={selected}
            onSelect={(response) => setSelected(response.items)}
            roots={defaultRootOrgUnits}
            warning={'No org. units selected'}
        />
    )
}

WithoutLevelAndGroupSelectorWithWarningText.story = {
    name: 'Without level and group selector, with warning text',
}
