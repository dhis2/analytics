import i18n from '@dhis2/d2-i18n'
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
    MenuDivider,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { OpenFileDialog } from '../OpenFileDialog/OpenFileDialog.js'
import {
    HoverMenuListItem,
    HoverMenuList,
    HoverMenuDropdown,
} from '../Toolbar/index.js'
import { TranslationDialog } from '../TranslationDialog/index.js'
import { DeleteDialog } from './DeleteDialog.js'
import { GetLinkDialog } from './GetLinkDialog.js'
import { RenameDialog } from './RenameDialog.js'
import { SaveAsDialog } from './SaveAsDialog.js'
import { supportedFileTypes } from './utils.js'

export const FileMenu = ({
    currentUser,
    defaultFilterVisType,
    fileType,
    fileObject,
    filterVisTypes,
    onNew,
    onOpen,
    onSave,
    onSaveAs,
    onRename,
    onShare,
    onDelete,
    onError,
    onTranslate,
}) => {
    const [currentDialog, setCurrentDialog] = useState(null)
    const onMenuItemClick = (dialogToOpen) => () => {
        setCurrentDialog(dialogToOpen)
    }
    const onDialogClose = () => setCurrentDialog(null)
    const onDeleteConfirm = () => {
        // The dialog must be closed before calling the callback
        // otherwise the fileObject is changed to null before the
        // dialog is closed causing a crash in renderDialog() below
        // due to fileObject.id not being available
        onDialogClose()
        onDelete()
    }

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
                        onTranslationSaved={() => {
                            onDialogClose()
                            onTranslate()
                        }}
                    />
                )
            case 'sharing':
                return (
                    <SharingDialog
                        type={fileType}
                        id={fileObject.id}
                        onClose={onDialogClose}
                        onSave={onShare}
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
                        onSaveAs={onSaveAs || Function.prototype}
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
            <OpenFileDialog
                open={currentDialog === 'open'}
                type={fileType}
                filterVisTypes={filterVisTypes}
                defaultFilterVisType={defaultFilterVisType}
                onClose={onDialogClose}
                onFileSelect={(id) => {
                    onOpen(id)
                    onDialogClose()
                }}
                onNew={onNew}
                currentUser={currentUser}
            />
            <HoverMenuDropdown label={i18n.t('File')}>
                <HoverMenuList dataTest="file-menu-container">
                    <HoverMenuListItem
                        label={i18n.t('New')}
                        icon={<IconAdd24 color={iconActiveColor} />}
                        onClick={onNew}
                        dataTest="file-menu-new"
                    />
                    <MenuDivider dense />
                    <HoverMenuListItem
                        label={i18n.t('Open…')}
                        icon={<IconLaunch24 color={iconActiveColor} />}
                        onClick={onMenuItemClick('open')}
                        dataTest="file-menu-open"
                    />
                    <HoverMenuListItem
                        label={
                            fileObject?.id ? i18n.t('Save') : i18n.t('Save…')
                        }
                        icon={
                            <IconSave24
                                color={
                                    !onSave ||
                                    !(
                                        !fileObject?.id ||
                                        fileObject?.access?.update
                                    )
                                        ? iconInactiveColor
                                        : iconActiveColor
                                }
                            />
                        }
                        disabled={
                            !onSave ||
                            !(!fileObject?.id || fileObject?.access?.update)
                        }
                        onClick={
                            fileObject?.id ? onSave : onMenuItemClick('saveas')
                        }
                        dataTest="file-menu-save"
                    />
                    <HoverMenuListItem
                        label={i18n.t('Save as…')}
                        icon={
                            <IconSave24
                                color={
                                    !(onSaveAs && fileObject?.id)
                                        ? iconInactiveColor
                                        : iconActiveColor
                                }
                            />
                        }
                        disabled={!(onSaveAs && fileObject?.id)}
                        onClick={onMenuItemClick('saveas')}
                        dataTest="file-menu-saveas"
                    />
                    <HoverMenuListItem
                        label={i18n.t('Rename…')}
                        icon={
                            <IconEdit24
                                color={
                                    fileObject?.id && fileObject?.access?.update
                                        ? iconActiveColor
                                        : iconInactiveColor
                                }
                            />
                        }
                        disabled={
                            !(fileObject?.id && fileObject?.access?.update)
                        }
                        onClick={onMenuItemClick('rename')}
                        dataTest="file-menu-rename"
                    />
                    <HoverMenuListItem
                        label={i18n.t('Translate…')}
                        icon={
                            <IconTranslate24
                                color={
                                    fileObject?.id && fileObject?.access?.update
                                        ? iconActiveColor
                                        : iconInactiveColor
                                }
                            />
                        }
                        disabled={
                            !(fileObject?.id && fileObject?.access?.update)
                        }
                        onClick={onMenuItemClick('translate')}
                        dataTest="file-menu-translate"
                    />
                    <MenuDivider dense />
                    <HoverMenuListItem
                        label={i18n.t('Share…')}
                        icon={
                            <IconShare24
                                color={
                                    fileObject?.id && fileObject?.access?.manage
                                        ? iconActiveColor
                                        : iconInactiveColor
                                }
                            />
                        }
                        disabled={
                            !(fileObject?.id && fileObject?.access?.manage)
                        }
                        onClick={onMenuItemClick('sharing')}
                        dataTest="file-menu-sharing"
                    />
                    <HoverMenuListItem
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
                    <MenuDivider dense />
                    <HoverMenuListItem
                        label={i18n.t('Delete')}
                        destructive
                        icon={
                            <IconDelete24
                                color={
                                    fileObject?.id && fileObject?.access?.delete
                                        ? colors.red700
                                        : iconInactiveColor
                                }
                            />
                        }
                        disabled={
                            !(fileObject?.id && fileObject?.access?.delete)
                        }
                        onClick={onMenuItemClick('delete')}
                        dataTest="file-menu-delete"
                    />
                </HoverMenuList>
            </HoverMenuDropdown>
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
    onShare: Function.prototype,
    onTranslate: Function.prototype,
}

FileMenu.propTypes = {
    currentUser: PropTypes.object,
    defaultFilterVisType: PropTypes.string,
    fileObject: PropTypes.object,
    fileType: PropTypes.oneOf(supportedFileTypes),
    filterVisTypes: PropTypes.array,
    onDelete: PropTypes.func,
    onError: PropTypes.func,
    onNew: PropTypes.func,
    onOpen: PropTypes.func,
    onRename: PropTypes.func,
    onSave: PropTypes.func,
    onSaveAs: PropTypes.func,
    onShare: PropTypes.func,
    onTranslate: PropTypes.func,
}

export default FileMenu
