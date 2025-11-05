import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { InterpretationsAndDetailsToggler } from '../index.js'

describe('<InterpretationsAndDetailsToggler/>', () => {
    const noop = () => {}

    test('accepts an `onClick` prop', async () => {
        const user = userEvent.setup()

        const onClick = jest.fn()

        render(<InterpretationsAndDetailsToggler onClick={onClick} />)

        await user.click(screen.getByRole('button'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('accepts a `dataTest` prop', () => {
        const dataTest = 'test'

        render(
            <InterpretationsAndDetailsToggler
                onClick={noop}
                dataTest={dataTest}
            />
        )

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    test('accepts a `disabled` prop', () => {
        render(<InterpretationsAndDetailsToggler disabled onClick={noop} />)

        expect(screen.getByRole('button')).toBeDisabled()
    })

    test('accepts an `isShowing` prop', () => {
        const showingDataTest =
            'dhis2-analytics-interpretationsanddetailstoggler-showing'

        render(<InterpretationsAndDetailsToggler onClick={noop} />)

        expect(screen.queryByTestId(showingDataTest)).not.toBeInTheDocument()

        render(<InterpretationsAndDetailsToggler isShowing onClick={noop} />)

        expect(screen.getByTestId(showingDataTest)).toBeInTheDocument()
    })
})
