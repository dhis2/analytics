import { render } from '@testing-library/react'
import React from 'react'
import PeriodTransfer from '../PeriodTransfer.js'

test('PeriodSelector matched the snapshot', () => {
    const props = {
        initialSelectedPeriods: [],
        onSelect: jest.fn(),
        rightFooter: <></>,
        dataTest: 'period-dimension',
    }

    const { container } = render(<PeriodTransfer {...props} />)

    expect(container).toMatchSnapshot()
})
