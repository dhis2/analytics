import {
    IconAdd24,
    IconLaunch24,
    IconSave24,
    IconEdit24,
    IconTranslate24,
    IconShare24,
    IconLink24,
    IconDelete24,
    SharingDialog,
    colors,
    FlyoutMenu,
    Layer,
    MenuItem,
    MenuDivider,
    Popper,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { createRef, useState } from 'react'
import i18n from '../../locales/index.js'
import { OpenFileDialog } from '../OpenFileDialog/OpenFileDialog.js'
import { TranslationDialog } from '../TranslationDialog/index.js'
import { DeleteDialog } from './DeleteDialog.js'
import { fileMenuStyles } from './FileMenu.styles.js'
import { GetLinkDialog } from './GetLinkDialog.js'
import { RenameDialog } from './RenameDialog.js'
import { SaveAsDialog } from './SaveAsDialog.js'
import { supportedFileTypes } from './utils.js'

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
    const [currentDialog, setCurrentDialog] = useState(null)

    // Escape key press closes the menu
    const onKeyDown = e => {
        if (e?.keyCode === 27) {
            setMenuIsOpen(false)
        }
    }
    const onMenuItemClick = dialogToOpen => () => {
        setMenuIsOpen(false)
        setCurrentDialog(dialogToOpen)
    }
    const onDialogClose = () => setCurrentDialog(null)
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
        switch (currentDialog) {
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
                        objectToTranslate={fileObject}
                        fieldsToTranslate={['name', 'description']}
                        onClose={onDialogClose}
                        onTranslationSaved={onTranslate}
                    />
                )
            case 'sharing':
                return (
                    <SharingDialog
                        open={true}
                        type={fileType}
                        id={fileObject.id}
                        onClose={onDialogClose}
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
        <div onKeyDown={onKeyDown}>
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
            <OpenFileDialog
                open={currentDialog === 'open'}
                type={fileType}
                onClose={onDialogClose}
                onFileSelect={id => {
                    onOpen(id)
                    onDialogClose()
                }}
                onNew={onNew}
                currentUser={d2.currentUser}
            />
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
        </div>
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
