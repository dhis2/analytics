import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { DeleteDialog } from '../DeleteDialog.js'

describe('FileMenu - DeleteDialog component', () => {
    const props = {
        type: 'visualization',
        id: 'delete-test',
        onClose: jest.fn(),
    }

    test('renders a Modal component', () => {
        render(<DeleteDialog {...props} />)

        const modalComponent = screen.getByTestId('file-menu-delete-modal')
        expect(modalComponent).toBeInTheDocument()
    })

    test('renders a ModalTitle containing the type prop', () => {
        render(<DeleteDialog {...props} />)

        const modalTitleComponent = screen.getByText(`Delete ${props.type}`)
        expect(modalTitleComponent).toBeInTheDocument()
    })

    test('calls the onClose callback when the Cancel button is clicked', async () => {
        const user = userEvent.setup()

        render(<DeleteDialog {...props} />)

        const cancelButton = screen.getByRole('button', { name: 'Cancel' })

        await user.click(cancelButton)

        expect(props.onClose).toHaveBeenCalledTimes(1)
    })
})
