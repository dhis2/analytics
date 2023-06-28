import { CustomDataProvider } from '@dhis2/app-runtime'
import { render, fireEvent, screen, getByText } from '@testing-library/react'
import '@testing-library/jest-dom'
import React from 'react'
import { HoverMenuBar } from '../../Toolbar/index.js'
import { FileMenu } from '../FileMenu.js'

jest.mock(
    '../../TranslationDialog/TranslationModal/useTranslationsResults.js',
    () => ({
        /* This will keep the translation dialog in
         * a loading state, which prevents it from
         * throwing other errors */
        useTranslationsResults: () => ({
            translationsData: undefined,
            fetching: true,
        }),
    })
)

describe('The FileMenu component ', () => {
    const onDelete = jest.fn()
    const onError = jest.fn()
    const onNew = jest.fn()
    const onOpen = jest.fn()
    const onRename = jest.fn()
    const onSave = jest.fn()
    const onSaveAs = jest.fn()
    const onShare = jest.fn()
    const onTranslate = jest.fn()

    const baseProps = {
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

    const fullAccessProps = {
        fileObject: {
            id: 'test',
            access: {
                delete: true,
                manage: true,
                update: true,
            },
            href: 'http://dhis2.org',
        },
    }

    const renderFileMenu = (customProps = {}) => {
        const props = { ...baseProps, ...customProps }
        const providerData = {
            translations: {
                translations: {},
            },
            sharing: {
                meta: {
                    allowPublicAccess: true,
                },
                object: {
                    userAccesses: [],
                    userGroupAccesses: [],
                },
            },
        }

        return render(
            <CustomDataProvider data={providerData}>
                <HoverMenuBar>
                    <FileMenu {...props} />
                </HoverMenuBar>
            </CustomDataProvider>
        )
    }

    const openDropdown = async () => {
        fireEvent.click(screen.getByTestId('dhis2-analytics-hovermenudropdown'))
        expect(await screen.findByTestId('file-menu-container')).toBeVisible()
    }

    const MENU_ITEMS = {
        NEW: { testId: 'file-menu-new', text: 'New' },
        OPEN: { testId: 'file-menu-open', text: 'Open…' },
        SAVE: { testId: 'file-menu-save', text: 'Save' },
        SAVE_AS: { testId: 'file-menu-saveas', text: 'Save as…' },
        RENAME: { testId: 'file-menu-rename', text: 'Rename…' },
        TRANSLATE: { testId: 'file-menu-translate', text: 'Translate…' },
        SHARE: { testId: 'file-menu-sharing', text: 'Share…' },
        GET_LINK: { testId: 'file-menu-getlink', text: 'Get link…' },
        DELETE: { testId: 'file-menu-delete', text: 'Delete' },
    }

    const assertMenuItemsDisabledState = (menuItems) => {
        for (const menuTitem of menuItems) {
            const li = screen.getByTestId(menuTitem.testId)
            expect(getByText(li, menuTitem.text)).toBeVisible()

            if (menuTitem.disabled) {
                expect(li).toHaveClass('disabled')
            } else {
                expect(li).not.toHaveClass('disabled')
            }
        }
    }

    it('renders a button', () => {
        renderFileMenu()
        expect(
            screen.getAllByTestId('dhis2-analytics-hovermenudropdown')
        ).toHaveLength(1)

        const button = screen.getByTestId('dhis2-analytics-hovermenudropdown')
        expect(button).toBeVisible()
        expect(button).toHaveTextContent('File')
    })

    it('opens when clicking the button', async () => {
        renderFileMenu()

        expect(
            screen.queryByTestId('file-menu-container')
        ).not.toBeInTheDocument()

        await openDropdown()

        expect(await screen.findByTestId('file-menu-container')).toBeVisible()
    })

    it('renders some enabled buttons regardless of the access settings', async () => {
        renderFileMenu()
        await openDropdown()

        assertMenuItemsDisabledState([
            { ...MENU_ITEMS.NEW, disabled: false },
            { ...MENU_ITEMS.OPEN, disabled: false },
        ])
    })

    it('renders some disabled buttons when no fileObject is present', async () => {
        renderFileMenu()
        await openDropdown()

        assertMenuItemsDisabledState([
            { ...MENU_ITEMS.SAVE_AS, disabled: true },
            { ...MENU_ITEMS.RENAME, disabled: true },
            { ...MENU_ITEMS.TRANSLATE, disabled: true },
            { ...MENU_ITEMS.SHARE, disabled: true },
            { ...MENU_ITEMS.GET_LINK, disabled: true },
            { ...MENU_ITEMS.DELETE, disabled: true },
        ])
    })

    it('renders some enabled buttons when update access is granted', async () => {
        const customProps = {
            fileObject: {
                id: 'test',
                access: {
                    delete: false,
                    manage: false,
                    update: true,
                },
            },
        }

        renderFileMenu(customProps)
        await openDropdown()

        assertMenuItemsDisabledState([
            { ...MENU_ITEMS.SAVE, disabled: false },
            { ...MENU_ITEMS.RENAME, disabled: false },
            { ...MENU_ITEMS.TRANSLATE, disabled: false },
        ])
    })

    it('renders enabled Delete button when delete access is granted', async () => {
        const customProps = {
            fileObject: {
                id: 'test',
                access: {
                    delete: true,
                    manage: false,
                    update: false,
                },
            },
        }

        renderFileMenu(customProps)
        await openDropdown()

        assertMenuItemsDisabledState([
            { ...MENU_ITEMS.DELETE, disabled: false },
        ])
    })

    it('renders enabled Share button when manage access is granted', async () => {
        const customProps = {
            fileObject: {
                id: 'test',
                access: {
                    delete: false,
                    manage: true,
                    update: false,
                },
            },
        }

        renderFileMenu(customProps)
        await openDropdown()

        assertMenuItemsDisabledState([{ ...MENU_ITEMS.SHARE, disabled: false }])
    })

    it('renders the OpenFileDialog component when the Open button is clicked', async () => {
        renderFileMenu()
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.OPEN.testId))

        expect(
            await screen.findByText('Open a visualization', { selector: 'h1' })
        ).toBeVisible()
    })

    it('renders the RenameDialog when the Rename button is clicked', async () => {
        renderFileMenu(fullAccessProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.RENAME.testId))

        expect(
            await screen.findByText('Rename visualization', { selector: 'h1' })
        ).toBeVisible()
    })

    it('renders the TranslationDialog when the Translate button is clicked', async () => {
        renderFileMenu(fullAccessProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.TRANSLATE.testId))

        expect(
            await screen.findByText('Translate', {
                exact: false,
                selector: 'h1',
            })
        ).toBeVisible()
    })

    it('renders the SharingDialog when the Share button is clicked', async () => {
        renderFileMenu(fullAccessProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.SHARE.testId))

        expect(
            await screen.findByText('Sharing and access', { selector: 'h1' })
        ).toBeVisible()
    })

    it('renders the GetLinkDialog when the Get link button is clicked', async () => {
        const url = 'http://localhost/dhis-web-data-visualizer/#/test'

        renderFileMenu(fullAccessProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.GET_LINK.testId))

        expect(await screen.findByTestId('dhis2-uicore-modal')).toBeVisible()
        expect(screen.getByRole('link', { name: url })).toHaveAttribute(
            'href',
            url
        )
    })

    it('renders the DeleteDialog when the Delete button is clicked', async () => {
        const customProps = {
            fileObject: {
                id: 'delete-test',
                access: {
                    delete: true,
                    manage: true,
                    update: true,
                },
            },
        }

        renderFileMenu(customProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.DELETE.testId))

        expect(
            await screen.findByText('Delete visualization', { selector: 'h1' })
        ).toBeVisible()
    })

    it('renders the SaveAsDialog when the Save as… button is clicked', async () => {
        renderFileMenu(fullAccessProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.SAVE_AS.testId))

        expect(
            await screen.findByText('Save visualization as', { selector: 'h1' })
        ).toBeVisible()
    })

    it('renders the SaveAsDialog when the Save… button is clicked but no fileObject is present', async () => {
        const customProps = {
            fileObject: {
                // NOTE: no `id` field
                access: {
                    update: true,
                },
            },
        }
        renderFileMenu(customProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.SAVE.testId))

        expect(
            await screen.findByText('Save visualization as', { selector: 'h1' })
        ).toBeVisible()
    })

    it('calls the onSave callback when the Save button is clicked and a fileObject is present', async () => {
        renderFileMenu(fullAccessProps)
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.SAVE.testId))

        expect(screen.queryByText('Open a visualization')).not.toBeVisible()
        expect(onSave).toHaveBeenCalledTimes(1)
    })

    it('calls the onNew callback when the New button is clicked', async () => {
        renderFileMenu()
        await openDropdown()
        fireEvent.click(screen.getByTestId(MENU_ITEMS.NEW.testId))

        expect(screen.queryByText('Open a visualization')).not.toBeVisible()
        expect(onNew).toHaveBeenCalledTimes(1)
    })
})
