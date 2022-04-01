import { SharingDialog } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { OpenFileDialog } from '../../OpenFileDialog/OpenFileDialog.js'
import { TranslationDialog } from '../../TranslationDialog/index.js'
import { DeleteDialog } from '../DeleteDialog.js'
import { FileMenu } from '../FileMenu.js'
import { GetLinkDialog } from '../GetLinkDialog.js'
import { RenameDialog } from '../RenameDialog.js'
import { SaveAsDialog } from '../SaveAsDialog.js'

describe('The FileMenu component ', () => {
    let shallowFileMenu
    let props

    const onDelete = jest.fn()
    const onError = jest.fn()
    const onNew = jest.fn()
    const onOpen = jest.fn()
    const onRename = jest.fn()
    const onSave = jest.fn()
    const onSaveAs = jest.fn()
    const onShare = jest.fn()
    const onTranslate = jest.fn()

    const getFileMenuComponent = (props) => {
        if (!shallowFileMenu) {
            shallowFileMenu = shallow(<FileMenu {...props} />)
        }
        return shallowFileMenu
    }

    beforeEach(() => {
        shallowFileMenu = undefined
        props = {
            currentUser: { id: 'u1', displayName: 'Test user' },
            fileType: 'visualization',
            fileObject: undefined,
            onDelete,
            onError,
            onNew,
            onOpen,
            onRename,
            onSave,
            onSaveAs,
            onShare,
            onTranslate,
        }
    })

    it('renders a button', () => {
        expect(getFileMenuComponent(props).find('button')).toHaveLength(1)
    })

    it('renders some enabled buttons regardless of the access settings', () => {
        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        const buttonLabels = ['New', 'Open…']

        buttonLabels.forEach((buttonLabel) =>
            expect(
                fileMenuComponent
                    .findWhere((n) => n.prop('label') === buttonLabel)
                    .prop('disabled')
            ).toBe(undefined)
        )
    })

    it('renders some disabled buttons when no fileObject is present', () => {
        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        const buttonLabels = [
            'Save as…',
            'Rename…',
            'Translate…',
            'Share…',
            'Get link…',
            'Delete',
        ]

        buttonLabels.forEach((buttonLabel) =>
            expect(
                fileMenuComponent
                    .findWhere((n) => n.prop('label') === buttonLabel)
                    .prop('disabled')
            ).toBe(true)
        )
    })

    it('renders some enabled buttons when update access is granted', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: false,
                manage: false,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        const buttonLabels = ['Save', 'Rename…', 'Translate…']

        buttonLabels.forEach((buttonLabel) =>
            expect(
                fileMenuComponent
                    .findWhere((n) => n.prop('label') === buttonLabel)
                    .prop('disabled')
            ).toBe(false)
        )
    })

    it('renders enabled Delete button when delete access is granted', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: false,
                update: false,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        expect(
            fileMenuComponent
                .findWhere((n) => n.prop('label') === 'Delete')
                .prop('disabled')
        ).toBe(false)
    })

    it('renders enabled Share button when manage access is granted', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: false,
                manage: true,
                update: false,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        expect(
            fileMenuComponent
                .findWhere((n) => n.prop('label') === 'Share…')
                .prop('disabled')
        ).toBe(false)
    })

    it('renders the OpenFileDialog component when the Open button is clicked', () => {
        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Open…')
            .simulate('click')

        expect(fileMenuComponent.find(OpenFileDialog)).toHaveLength(1)
    })

    it('renders the RenameDialog when the Rename button is clicked', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Rename…')
            .simulate('click')

        expect(fileMenuComponent.find(RenameDialog)).toHaveLength(1)
    })

    it('renders the TranslationDialog when the Translate button is clicked', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Translate…')
            .simulate('click')

        expect(fileMenuComponent.find(TranslationDialog)).toHaveLength(1)
    })

    it('renders the SharingDialog when the Share button is clicked', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Share…')
            .simulate('click')

        expect(fileMenuComponent.find(SharingDialog)).toHaveLength(1)
    })

    it('renders the GetLinkDialog when the Get link button is clicked', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Get link…')
            .simulate('click')

        expect(fileMenuComponent.find(GetLinkDialog)).toHaveLength(1)
    })

    it('renders the DeleteDialog when the Delete button is clicked', () => {
        props.fileObject = {
            id: 'delete-test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Delete')
            .simulate('click')

        expect(fileMenuComponent.find(DeleteDialog)).toHaveLength(1)
    })

    it('renders the SaveAsDialog when the Save as… button is clicked', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Save as…')
            .simulate('click')

        expect(fileMenuComponent.find(SaveAsDialog)).toHaveLength(1)
    })

    it('renders the SaveAsDialog when the Save… button is clicked but no fileObject is present', () => {
        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Save…')
            .simulate('click')

        expect(fileMenuComponent.find(SaveAsDialog)).toHaveLength(1)
    })

    it('calls the onSave callback when the Save button is clicked and a fileObject is present', () => {
        props.fileObject = {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
        }

        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'Save')
            .simulate('click')

        expect(fileMenuComponent.find(OpenFileDialog).prop('open')).toBe(false)
        expect(onSave).toHaveBeenCalled()
    })

    it('calls the onNew callback when the New button is clicked', () => {
        const fileMenuComponent = getFileMenuComponent(props)
        fileMenuComponent.find('button').simulate('click')

        fileMenuComponent
            .findWhere((n) => n.prop('label') === 'New')
            .simulate('click')

        expect(fileMenuComponent.find(OpenFileDialog).prop('open')).toBe(false)
        expect(onNew).toHaveBeenCalled()
    })
})
