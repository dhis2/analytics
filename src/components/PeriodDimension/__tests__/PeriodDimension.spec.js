import React from 'react'
import renderer from 'react-test-renderer'
import { PeriodDimension } from '../PeriodDimension'

jest.mock('../../PeriodSelector/PeriodSelector', () => ({
    __esModule: true,
    default: 'mockPeriodSelector',
    namedExport: jest.fn(),
}))

describe('The Period Dimension component', () => {
    const props = {
        selectedPeriods: [],
        onSelect: jest.fn(),
        onDeselect: jest.fn(),
        onReorder: jest.fn(),
        /*
        ui: {
            itemsByDimension: {
                [peId]: [],
            },
        },
        metadata: {},
        addMetadata: jest.fn(),
        addUiItems: jest.fn(),
        removeUiItems: jest.fn(),
        setUiItems: jest.fn(),
        context: { d2: {} },
        */
    }

    it('renders correctly', () => {
        const tree = renderer.create(<PeriodDimension {...props} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
