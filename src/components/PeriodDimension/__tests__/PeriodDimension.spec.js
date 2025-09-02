import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import PeriodDimension from '../PeriodDimension.js'

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: () => ({ systemInfo: {} }),
    useDataQuery: () => ({ data: { userSettings: { keyUiLocale: 'en' } } }),
}))

global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}))

afterEach(jest.clearAllMocks)

const props = {
    selectedPeriods: [],
    onSelect: jest.fn(),
    rightFooter: <></>,
}

test('PeriodDimension renders the tabs for relative/fixed with relative pre-selected', () => {
    render(<PeriodDimension {...props} />)

    expect(screen.getByText('Relative periods')).toBeInTheDocument()
    expect(
        screen.getByTestId('period-dimension-relative-period-filter')
    ).toBeInTheDocument()
    expect(screen.getByText('Fixed periods')).toBeInTheDocument()
})

test('PeriodDimension can toggle between relative and fixed period tab', async () => {
    const user = userEvent.setup()

    render(<PeriodDimension {...props} />)

    expect(screen.getByText('Relative periods')).toBeInTheDocument()

    const fixedPeriodButton = screen.getByText('Fixed periods')

    expect(fixedPeriodButton).toBeInTheDocument()

    await user.click(fixedPeriodButton)

    expect(
        screen.getByTestId('period-dimension-fixed-period-filter')
    ).toBeInTheDocument()
})
