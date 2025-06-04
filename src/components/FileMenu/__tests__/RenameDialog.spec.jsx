import '@testing-library/jest-dom'
import { render, fireEvent, screen, within } from '@testing-library/react'
import React from 'react'
import { RenameDialog } from '../RenameDialog.jsx'

describe('The FileMenu - RenameDialog component', () => {
    const onClose = jest.fn()
    const onRename = jest.fn()
    const props = {
        type: 'visualization',
        object: {
            id: 'rename-test',
        },
        onClose,
        onRename,
    }

    beforeEach(() => {
        jest.resetAllMocks()
        jest.clearAllMocks()
    })

    it('renders a Modal component with the correct heading', () => {
        render(<RenameDialog {...props} />)
        expect(screen.getAllByTestId('file-menu-rename-modal')).toHaveLength(1)
        expect(screen.getByRole('heading')).toHaveTextContent(
            'Rename visualization'
        )
    })

    it('renders a InputField for name', () => {
        render(<RenameDialog {...props} />)
        expect(
            screen.getByTestId('file-menu-rename-modal-name')
        ).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeVisible()
    })

    it('renders a InputField for name with prefilled value if name is in object prop', () => {
        render(
            <RenameDialog
                {...props}
                object={{ ...props.object, name: 'Vis test' }}
            />
        )

        const ancestorElement = screen.getByTestId(
            'file-menu-rename-modal-name'
        )
        const inputElement = within(ancestorElement).getByRole('textbox')

        expect(inputElement).toBeInTheDocument()
        expect(inputElement).toHaveValue('Vis test')
    })

    it('renders a TextAreaField for description', () => {
        render(<RenameDialog {...props} />)

        // Locate the label by its text
        const labelElement = screen.getByText('Description')

        // Find the textarea element within the same container as the label
        const descriptionField = labelElement
            .closest('div')
            .querySelector('textarea')

        expect(descriptionField).toBeInTheDocument()
        expect(descriptionField).toBeVisible()
    })

    it('renders a TextAreaField for description with prefilled value if description is in object prop', () => {
        render(
            <RenameDialog
                {...props}
                object={{
                    ...props.object,
                    description: 'Long explanation of the visualization',
                }}
            />
        )

        // Locate the label by its text
        const labelElement = screen.getByText('Description')

        // Find the textarea element within the same container as the label
        const descriptionField = labelElement
            .closest('div')
            .querySelector('textarea')

        expect(descriptionField).toBeInTheDocument()
        expect(descriptionField).toHaveValue(
            'Long explanation of the visualization'
        )
    })

    it('calls the onClose callback when the Cancel button is clicked', async () => {
        render(<RenameDialog {...props} />)
        await fireEvent.click(
            screen.getByTestId('file-menu-rename-modal-cancel')
        )

        expect(onClose).toHaveBeenCalled()
        expect(onRename).not.toHaveBeenCalled()
    })

    it('calls the onRename callback when the Rename button is clicked', async () => {
        render(<RenameDialog {...props} />)
        await fireEvent.click(
            screen.getByTestId('file-menu-rename-modal-rename')
        )

        expect(onRename).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
    })
})
