import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { Editor } from '../Editor.js'

const mockConvertCtrlKey = jest.fn()
jest.mock('../markdownHandler.js', () => ({
    convertCtrlKey: () => mockConvertCtrlKey(),
}))

jest.mock('../../../UserMention/UserMentionWrapper.js', () => ({
    UserMentionWrapper: jest.fn((props) => <>{props.children}</>),
}))

describe('RichText: Editor component', () => {
    const componentProps = {
        value: '',
        onChange: jest.fn(),
    }

    beforeEach(() => {
        mockConvertCtrlKey.mockClear()
    })

    const renderComponent = (props) => {
        return render(<Editor {...props} />)
    }

    test('renders a result', () => {
        renderComponent(componentProps)

        expect(
            screen.getByTestId('@dhis2-analytics-richtexteditor')
        ).toBeVisible()
    })

    test('calls convertCtrlKey on keydown', async () => {
        const user = userEvent.setup()

        renderComponent(componentProps)

        await user.click(screen.getByRole('textbox'))
        await user.keyboard('A')

        expect(mockConvertCtrlKey).toHaveBeenCalled()
    })
})
