import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { RenameDialog } from '../RenameDialog.js'

describe('FileMenu - RenameDialog component', () => {
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

    test('renders a Modal component with the correct heading', () => {
        render(<RenameDialog {...props} />)
        expect(screen.getAllByTestId('file-menu-rename-modal')).toHaveLength(1)
        expect(screen.getByRole('heading')).toHaveTextContent(
            'Rename visualization'
        )
    })

    test('renders a InputField for name', () => {
        render(<RenameDialog {...props} />)
        expect(
            screen.getByTestId('file-menu-rename-modal-name')
        ).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeInTheDocument()
        expect(screen.getByText('Name')).toBeVisible()
    })

    test('renders a InputField for name with prefilled value if name is in object prop', () => {
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

    test('renders a TextAreaField for description', () => {
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

    test('renders a TextAreaField for description with prefilled value if description is in object prop', () => {
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

    test('calls the onClose callback when the Cancel button is clicked', async () => {
        const user = userEvent.setup()

        render(<RenameDialog {...props} />)
        await user.click(screen.getByRole('button', { name: 'Cancel' }))

        expect(onClose).toHaveBeenCalled()
        expect(onRename).not.toHaveBeenCalled()
    })

    test('calls the onRename callback when the Rename button is clicked', async () => {
        const user = userEvent.setup()

        render(<RenameDialog {...props} />)
        await user.click(screen.getByRole('button', { name: 'Rename' }))

        expect(onRename).toHaveBeenCalled()
        expect(onClose).toHaveBeenCalled()
    })
})
