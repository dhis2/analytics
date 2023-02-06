import { Button, Modal, ModalTitle } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { RenameDialog } from '../RenameDialog.js'

describe('The FileMenu - RenameDialog component', () => {
    let shallowRenameDialog
    let props

    const onClose = jest.fn()

    const getRenameDialogComponent = (props) => {
        if (!shallowRenameDialog) {
            shallowRenameDialog = shallow(<RenameDialog {...props} />)
        }
        return shallowRenameDialog
    }

    beforeEach(() => {
        shallowRenameDialog = undefined
        props = {
            type: 'visualization',
            object: {
                id: 'rename-test',
            },
            onClose,
        }
    })

    it('renders a Modal component', () => {
        expect(getRenameDialogComponent(props).find(Modal)).toHaveLength(1)
    })

    it('renders a ModalTitle containing the type prop', () => {
        expect(
            getRenameDialogComponent(props).find(ModalTitle).childAt(0).text()
        ).toEqual(`Rename ${props.type}`)
    })

    it('renders a InputField for name', () => {
        expect(
            getRenameDialogComponent(props).findWhere(
                (n) => n.prop('label') === 'Name'
            )
        ).toHaveLength(1)
    })

    it('renders a InputField for name with prefilled value if name is in object prop', () => {
        props.object.name = 'Name test'

        const nameInputField = getRenameDialogComponent(props).findWhere(
            (n) => n.prop('label') === 'Name'
        )

        expect(nameInputField.prop('value')).toEqual(props.object.name)
    })

    it('renders a TextAreaField for description', () => {
        expect(
            getRenameDialogComponent(props).findWhere(
                (n) => n.prop('label') === 'Description'
            )
        ).toHaveLength(1)
    })

    it('renders a TextAreaField for description with prefilled value if description is in object prop', () => {
        props.object.description = 'Description test'

        const descriptionInputField = getRenameDialogComponent(props).findWhere(
            (n) => n.prop('label') === 'Description'
        )

        expect(descriptionInputField.prop('value')).toEqual(
            props.object.description
        )
    })

    it('calls the onClose callback when the Cancel button is clicked', () => {
        getRenameDialogComponent(props).find(Button).first().simulate('click')

        expect(onClose).toHaveBeenCalled()
    })
})
