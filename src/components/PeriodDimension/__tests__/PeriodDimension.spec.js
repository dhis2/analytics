import React from 'react'
import renderer from 'react-test-renderer'
import { PeriodDimension } from '../PeriodDimension'

/* eslint-disable react/display-name */
jest.mock('../../PeriodSelector/PeriodSelector', () => {
    return {
        __esModule: true,
        PeriodSelector: true,
        default: () => {
            return <div></div>
        },
    }
})
/* eslint-enable react/display-name */

describe('The Period Dimension component', () => {
    const props = {
        selectedPeriods: [],
        onSelect: jest.fn(),
        onDeselect: jest.fn(),
        onReorder: jest.fn(),
    }

    it('renders correctly', () => {
        const tree = renderer.create(<PeriodDimension {...props} />).toJSON()
        expect(tree).toMatchSnapshot()
    })
})
