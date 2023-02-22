import { DataProvider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import OrgUnitDimension from '../components/OrgUnitDimension/OrgUnitDimension.js'

const Wrapper = (story) => (
    <DataProvider
        baseUrl="https://debug.dhis2.org/analytics-dev/"
        apiVersion=""
    >
        {story()}
    </DataProvider>
)

const defaultRootOrgUnits = ['ImspTQPwCqd'] // Sierra Leone

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('None selected', () => {
        const [selected, setSelected] = useState([])

        return (
            <OrgUnitDimension
                selected={selected}
                onSelect={(response) => setSelected(response.items)}
                roots={defaultRootOrgUnits}
            />
        )
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Root selected', () => {
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
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Single level 2 child selected', () => {
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
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Multiple level 2 children selected', () => {
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
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Multiple selected across different levels', () => {
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
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Multiple roots', () => {
        const [selected, setSelected] = useState([])

        return (
            <OrgUnitDimension
                selected={selected}
                onSelect={(response) => setSelected(response.items)}
                roots={['O6uvpzGd5pu', 'fdc6uOvgoji']} // Bo + Bombali
            />
        )
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Without user org units selection', () => {
        const [selected, setSelected] = useState([])

        return (
            <OrgUnitDimension
                hideUserOrgUnits={true}
                selected={selected}
                onSelect={(response) => setSelected(response.items)}
                roots={defaultRootOrgUnits}
            />
        )
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Without level selector', () => {
        const [selected, setSelected] = useState([])

        return (
            <OrgUnitDimension
                hideLevelSelect={true}
                selected={selected}
                onSelect={(response) => setSelected(response.items)}
                roots={defaultRootOrgUnits}
            />
        )
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Without group selector', () => {
        const [selected, setSelected] = useState([])

        return (
            <OrgUnitDimension
                hideGroupSelect={true}
                selected={selected}
                onSelect={(response) => setSelected(response.items)}
                roots={defaultRootOrgUnits}
            />
        )
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Without level and group selector', () => {
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
    })

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('Without level and group selector, with warning text', () => {
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
    })
