import { render, screen } from '@testing-library/react'
import React from 'react'
import FixedPeriodSelect from '../FixedPeriodSelect.js'

test('FixedPeriodSelect renders correctly', () => {
    const props = {
        value: '201405',
        onChange: () => {},
    }

    render(<FixedPeriodSelect {...props} />)

    expect(
        screen.getByTestId('dhis2-analytics-fixedperiodselect')
    ).toBeInTheDocument()

    expect(screen.getByText('Period type')).toBeInTheDocument()
    expect(screen.getByText('Monthly')).toBeInTheDocument()
    expect(screen.getByText('Year')).toBeInTheDocument()

    const yearSelectEl = screen.getByPlaceholderText('Select year')
    expect(yearSelectEl).toBeInTheDocument()
    expect(yearSelectEl.value).toEqual('2014')
})
