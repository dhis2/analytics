import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { SaveAsDialog } from '../SaveAsDialog.js'

describe('FileMenu - SaveAsDialog component', () => {
    const onClose = jest.fn()
    const onSaveAs = jest.fn()

    const props = {
        type: 'visualization',
        object: {
            name: 'Save as name test',
            description: 'Save as description test',
        },
        onClose,
        onSaveAs,
    }

    test('renders a Modal component', () => {
        render(<SaveAsDialog {...props} />)
        expect(screen.getByTestId('file-menu-saveas-modal')).toBeInTheDocument()
    })

    test('renders a ModalTitle containing the type prop', () => {
        render(<SaveAsDialog {...props} />)
        expect(screen.getByRole('heading')).toHaveTextContent(
            `Save ${props.type} as`
        )
    })

    test('renders a InputField for name with prefilled value from the object prop', () => {
        render(<SaveAsDialog {...props} />)
        expect(
            screen.getByTestId('file-menu-saveas-modal-name')
        ).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeVisible()
        expect(
            screen.getByDisplayValue('Save as name test (copy)')
        ).toBeInTheDocument()
    })

    test('renders a TextAreaField for description with prefilled value from the object prop', () => {
        render(<SaveAsDialog {...props} />)
        expect(
            screen.getByTestId('file-menu-saveas-modal-description')
        ).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeInTheDocument()
        expect(screen.getByText('Description')).toBeVisible()
        expect(
            screen.getByDisplayValue(props.object.description)
        ).toBeInTheDocument()
    })

    test('calls the onSaveAs callback when the Save button is clicked', async () => {
        const user = userEvent.setup()

        render(<SaveAsDialog {...props} />)

        const saveButton = screen.getByRole('button', { name: 'Save' })
        await user.click(saveButton)

        expect(onSaveAs).toHaveBeenCalledWith({
            name: 'Save as name test (copy)',
            description: props.object.description,
        })
    })

    test('calls the onClose callback when the Cancel button is clicked', async () => {
        const user = userEvent.setup()

        render(<SaveAsDialog {...props} />)

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })
        await user.click(cancelButton)

        expect(onClose).toHaveBeenCalled()
    })
})
