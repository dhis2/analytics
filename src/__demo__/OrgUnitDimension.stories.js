import { DataProvider } from '@dhis2/app-runtime'
import { storiesOf } from '@storybook/react'
import React, { useState } from 'react'
import OrgUnitDimension from '../components/OrgUnitDimension/OrgUnitDimension'

const Wrapper = story => (
    <DataProvider baseUrl="http://localhost:8080/" apiVersion="">
        {story()}
    </DataProvider>
)

const rootOrgUnit = 'ImspTQPwCqd' // Sierra Leone

storiesOf('OrgUnitDimension', module)
    .addDecorator(Wrapper)
    .add('None selected', () => {
        const [selected, setSelected] = useState([])

        return (
            <>
                <OrgUnitDimension
                    selected={selected}
                    onSelect={response => setSelected(response.items)}
                    root={rootOrgUnit}
                />
                <div>
                    {selected.map(item => (
                        <p key={item.id}>
                            {item.id} - {item.path} - {item.name}
                        </p>
                    ))}
                </div>
            </>
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
                onSelect={response => setSelected(response.items)}
                root={rootOrgUnit}
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
                onSelect={response => setSelected(response.items)}
                root={rootOrgUnit}
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
                onSelect={response => setSelected(response.items)}
                root={rootOrgUnit}
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
                onSelect={response => setSelected(response.items)}
                root={rootOrgUnit}
            />
        )
    })
