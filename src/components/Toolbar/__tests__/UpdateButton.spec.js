import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { UpdateButton } from '../index.js'

describe('<UpdateButton/>', () => {
    const noop = () => {}

    test('accepts an `onClick` prop', async () => {
        const user = userEvent.setup()

        const onClick = jest.fn()

        render(<UpdateButton onClick={onClick} />)

        await user.click(screen.getByRole('button'))

        expect(onClick).toHaveBeenCalledTimes(1)
    })

    test('accepts a `dataTest` prop', () => {
        const dataTest = 'test'

        render(<UpdateButton onClick={noop} dataTest={dataTest} />)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    test('accepts a `disabled` prop', () => {
        render(<UpdateButton disabled onClick={noop} />)

        expect(screen.getByRole('button')).toBeDisabled()
    })

    test('accepts an `loading` prop', () => {
        render(<UpdateButton onClick={noop} loading />)

        expect(
            screen.getByTestId('dhis2-uicore-circularloader')
        ).toBeInTheDocument()
    })
})
