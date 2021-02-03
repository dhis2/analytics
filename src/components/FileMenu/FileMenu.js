import React, { createRef, useState } from 'react'

import PropTypes from '@dhis2/prop-types'
import i18n from '@dhis2/d2-i18n'
import FavoritesDialog from '@dhis2/d2-ui-favorites-dialog'
import TranslationDialog from '@dhis2/d2-ui-translation-dialog'
import SharingDialog from '@dhis2/d2-ui-sharing-dialog'
import {
    FlyoutMenu,
    Layer,
    MenuItem,
    MenuDivider,
    Popper,
} from '@dhis2/ui-core'
import { colors } from '@dhis2/ui-constants'
import {
    IconAdd24,
    IconLaunch24,
    IconSave24,
    IconEdit24,
    IconTranslate24,
    IconShare24,
    IconLink24,
    IconDelete24,
} from '@dhis2/ui'

import { supportedFileTypes } from './utils'
import { fileMenuStyles } from './FileMenu.styles'
import { GetLinkDialog } from './GetLinkDialog'
import { DeleteDialog } from './DeleteDialog'
import { RenameDialog } from './RenameDialog'
import { SaveAsDialog } from './SaveAsDialog'

export const FileMenu = ({
    d2, // to be removed as soon as TranslateDialog and FavoritesDialog are rewritten
    fileType,
    fileObject,
    onNew,
    onOpen,
    onSave,
    onSaveAs,
    onRename,
    //    onShare,
    onDelete,
    onError,
    onTranslate,
}) => {
    const [menuIsOpen, setMenuIsOpen] = useState(false)
    const [openDialog, setOpenDialog] = useState(null)

    const onMenuItemClick = dialogToOpen => () => {
        setMenuIsOpen(false)
        setOpenDialog(dialogToOpen)
    }
    const onDialogClose = () => setOpenDialog(null)
    const toggleMenu = () => setMenuIsOpen(!menuIsOpen)
    const onDeleteConfirm = () => {
        // The dialog must be closed before calling the callback
        // otherwise the fileObject is changed to null before the
        // dialog is closed causing a crash in renderDialog() below
        // due to fileObject.id not being available
        onDialogClose()
        onDelete()
    }

    const buttonRef = createRef()

    const renderDialog = () => {
        switch (openDialog) {
            case 'open':
                return (
                    <FavoritesDialog
                        open={true}
                        refreshData={true}
                        type={fileType}
                        d2={d2}
                        onRequestClose={onDialogClose}
                        onFavoriteSelect={onOpen}
                    />
                )
            case 'rename':
                return (
                    <RenameDialog
                        type={fileType}
                        object={fileObject}
                        onClose={onDialogClose}
                        onRename={onRename}
                        onError={onError}
                    />
                )
            case 'translate':
                return (
                    <TranslationDialog
                        open={true}
                        d2={d2}
                        objectToTranslate={{
                            ...fileObject,
                            // mock modelDefinition to avoid an error
                            // in the TranslationDialog component
                            modelDefinition: { name: fileType },
                        }}
                        fieldsToTranslate={['name', 'description']}
                        onRequestClose={onDialogClose}
                        onTranslationSaved={onTranslate}
                        onTranslationError={onError}
                    />
                )
            case 'sharing':
                return (
                    <SharingDialog
                        open={true}
                        d2={d2}
                        type={fileType}
                        id={fileObject.id}
                        onRequestClose={onDialogClose}
                    />
                )
            case 'getlink':
                return (
                    <GetLinkDialog
                        type={fileType}
                        id={fileObject.id}
                        onClose={onDialogClose}
                    />
                )
            case 'delete':
                return (
                    <DeleteDialog
                        type={fileType}
                        id={fileObject.id}
                        onDelete={onDeleteConfirm}
                        onError={onError}
                        onClose={onDialogClose}
                    />
                )
            case 'saveas':
                return (
                    <SaveAsDialog
                        type={fileType}
                        object={fileObject}
                        onSaveAs={onSaveAs}
                        onClose={onDialogClose}
                    />
                )
            default:
                return null
        }
    }

    const iconActiveColor = colors.grey700
    const iconInactiveColor = colors.grey500

    return (
        <>
            <style jsx>{fileMenuStyles}</style>
            <div ref={buttonRef}>
                <button
                    className="menu-toggle"
                    onClick={toggleMenu}
                    data-test="file-menu-toggle"
                >
                    {i18n.t('File')}
                </button>
            </div>
            {menuIsOpen && (
                <Layer
                    onClick={toggleMenu}
                    position="fixed"
                    level={2000}
                    dataTest="file-menu-toggle-layer"
                >
                    <Popper reference={buttonRef} placement="bottom-start">
                        <FlyoutMenu dataTest="file-menu-container">
                            <MenuItem
                                label={i18n.t('New')}
                                icon={<IconAdd24 color={iconActiveColor} />}
                                onClick={() => {
                                    toggleMenu()
                                    onNew()
                                }}
                                dataTest="file-menu-new"
                            />
                            <MenuDivider />
                            <MenuItem
                                label={i18n.t('Open…')}
                                icon={<IconLaunch24 color={iconActiveColor} />}
                                onClick={onMenuItemClick('open')}
                                dataTest="file-menu-open"
                            />
                            <MenuItem
                                label={
                                    fileObject?.id
                                        ? i18n.t('Save')
                                        : i18n.t('Save…')
                                }
                                icon={
                                    <IconSave24
                                        color={
                                            !fileObject?.id ||
                                            fileObject?.access?.update
                                                ? iconActiveColor
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={
                                    !(
                                        !fileObject?.id ||
                                        fileObject?.access?.update
                                    )
                                }
                                onClick={
                                    fileObject?.id
                                        ? () => {
                                              toggleMenu()
                                              onSave()
                                          }
                                        : onMenuItemClick('saveas')
                                }
                                dataTest="file-menu-save"
                            />
                            <MenuItem
                                label={i18n.t('Save as…')}
                                icon={
                                    <IconSave24
                                        color={
                                            fileObject?.id
                                                ? iconActiveColor
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={!fileObject?.id}
                                onClick={onMenuItemClick('saveas')}
                                dataTest="file-menu-saveas"
                            />
                            <MenuItem
                                label={i18n.t('Rename…')}
                                icon={
                                    <IconEdit24
                                        color={
                                            fileObject?.id &&
                                            fileObject?.access?.update
                                                ? iconActiveColor
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={
                                    !(
                                        fileObject?.id &&
                                        fileObject?.access?.update
                                    )
                                }
                                onClick={onMenuItemClick('rename')}
                                dataTest="file-menu-rename"
                            />
                            <MenuItem
                                label={i18n.t('Translate…')}
                                icon={
                                    <IconTranslate24
                                        color={
                                            fileObject?.id &&
                                            fileObject?.access?.update
                                                ? iconActiveColor
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={
                                    !(
                                        fileObject?.id &&
                                        fileObject?.access?.update
                                    )
                                }
                                onClick={onMenuItemClick('translate')}
                                dataTest="file-menu-translate"
                            />
                            <MenuDivider />
                            <MenuItem
                                label={i18n.t('Share…')}
                                icon={
                                    <IconShare24
                                        color={
                                            fileObject?.id &&
                                            fileObject?.access?.manage
                                                ? iconActiveColor
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={
                                    !(
                                        fileObject?.id &&
                                        fileObject?.access?.manage
                                    )
                                }
                                onClick={onMenuItemClick('sharing')}
                                dataTest="file-menu-sharing"
                            />
                            <MenuItem
                                label={i18n.t('Get link…')}
                                icon={
                                    <IconLink24
                                        color={
                                            fileObject?.id
                                                ? iconActiveColor
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={!fileObject?.id}
                                onClick={onMenuItemClick('getlink')}
                                dataTest="file-menu-getlink"
                            />
                            <MenuDivider />
                            <MenuItem
                                label={i18n.t('Delete')}
                                destructive
                                icon={
                                    <IconDelete24
                                        color={
                                            fileObject?.id &&
                                            fileObject?.access?.delete
                                                ? colors.red700
                                                : iconInactiveColor
                                        }
                                    />
                                }
                                disabled={
                                    !(
                                        fileObject?.id &&
                                        fileObject?.access?.delete
                                    )
                                }
                                onClick={onMenuItemClick('delete')}
                                dataTest="file-menu-delete"
                            />
                        </FlyoutMenu>
                    </Popper>
                </Layer>
            )}
            {renderDialog()}
        </>
    )
}

FileMenu.defaultProps = {
    onDelete: Function.prototype,
    onError: Function.prototype,
    onNew: Function.prototype,
    onOpen: Function.prototype,
    onRename: Function.prototype,
    onSave: Function.prototype,
    onSaveAs: Function.prototype,
    onTranslate: Function.prototype,
}

FileMenu.propTypes = {
    d2: PropTypes.object,
    fileObject: PropTypes.object,
    fileType: PropTypes.oneOf(supportedFileTypes),
    onDelete: PropTypes.func,
    onError: PropTypes.func,
    onNew: PropTypes.func,
    onOpen: PropTypes.func,
    onRename: PropTypes.func,
    onSave: PropTypes.func,
    onSaveAs: PropTypes.func,
    //    onShare: PropTypes.func,
    onTranslate: PropTypes.func,
}

export default FileMenu
