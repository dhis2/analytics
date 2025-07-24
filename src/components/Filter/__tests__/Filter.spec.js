import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import Filter from '../Filter.js'

const props = {
    placeholder: 'testplaceholder',
    text: '',
    onChange: jest.fn(),
    onClear: jest.fn(),
}

test('Filter renders an InputField component ', () => {
    render(<Filter {...props} />)

    const inputField = screen.getByTestId('dhis2-uiwidgets-inputfield')

    expect(inputField).toBeInTheDocument()
})

test('Filter renders an input field with the given placeholder', () => {
    render(<Filter {...props} />)

    const inputField = screen.getByPlaceholderText(props.placeholder)

    expect(inputField).toBeInTheDocument()
})

test('Filter should call prop onClear if onChange receives text string with length < 1 (Ctrl-A  + BackSpace)', async () => {
    const user = userEvent.setup()

    props.text = 'anotherTestString'

    render(<Filter {...props} />)

    const inputField = screen.getByPlaceholderText(props.placeholder)

    // focus on the input field in order to interact with it
    await user.click(inputField)
    await user.keyboard('{Control>}A{/Control}{Backspace}')

    expect(props.onClear).toHaveBeenCalledTimes(1)
})
