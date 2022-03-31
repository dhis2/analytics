import { Button, Modal, ModalTitle } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { DeleteDialog } from '../DeleteDialog.js'

describe('The FileMenu - DeleteDialog component', () => {
    let shallowDeleteDialog
    let props

    const onClose = jest.fn()

    const getDeleteDialogComponent = (props) => {
        if (!shallowDeleteDialog) {
            shallowDeleteDialog = shallow(<DeleteDialog {...props} />)
        }
        return shallowDeleteDialog
    }

    beforeEach(() => {
        shallowDeleteDialog = undefined
        props = {
            type: 'visualization',
            id: 'delete-test',
            onClose,
        }
    })

    it('renders a Modal component', () => {
        expect(getDeleteDialogComponent(props).find(Modal)).toHaveLength(1)
    })

    it('renders a ModalTitle containing the type prop', () => {
        expect(
            getDeleteDialogComponent(props).find(ModalTitle).childAt(0).text()
        ).toEqual(`Delete ${props.type}`)
    })

    it('calls the onClose callback when the Cancel button is clicked', () => {
        getDeleteDialogComponent(props).find(Button).first().simulate('click')

        expect(onClose).toHaveBeenCalled()
    })
})
