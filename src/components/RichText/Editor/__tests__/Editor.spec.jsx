import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Editor } from '../Editor.jsx'

const mockConvertCtrlKey = jest.fn()
jest.mock('../markdownHandler.js', () => ({
    convertCtrlKey: () => mockConvertCtrlKey(),
}))

jest.mock('../../../UserMention/UserMentionWrapper.jsx', () => ({
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

    it('renders a result', () => {
        renderComponent(componentProps)

        expect(
            screen.getByTestId('@dhis2-analytics-richtexteditor')
        ).toBeVisible()
    })

    it('calls convertCtrlKey on keydown', () => {
        renderComponent(componentProps)

        fireEvent.keyDown(screen.getByRole('textbox'), {
            key: 'A',
            code: 'keyA',
        })

        expect(mockConvertCtrlKey).toHaveBeenCalled()
    })
})
