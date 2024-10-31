import i18n from '@dhis2/d2-i18n'
import {
    Button,
    Popover,
    Tooltip,
    Help,
    IconAt24,
    IconFaceAdd24,
    IconLink24,
    IconTextBold24,
    IconTextItalic24,
    colors,
} from '@dhis2/ui'
import cx from 'classnames'
import PropTypes from 'prop-types'
import React, { forwardRef, useRef, useEffect, useState } from 'react'
import { UserMentionWrapper } from '../../UserMention/UserMentionWrapper.js'
import { Parser } from '../Parser/Parser.js'
import {
    convertCtrlKey,
    insertMarkdown,
    emojis,
    EMOJI_SMILEY_FACE,
    EMOJI_SAD_FACE,
    EMOJI_THUMBS_UP,
    EMOJI_THUMBS_DOWN,
    BOLD,
    ITALIC,
    LINK,
    MENTION,
} from './markdownHandler.js'
import {
    mainClasses,
    toolbarClasses,
    tooltipAnchorClasses,
    emojisPopoverClasses,
} from './styles/Editor.style.js'

const EmojisPopover = ({ onInsertMarkdown, onClose, reference }) => (
    <Popover reference={reference} onClickOutside={onClose}>
        <ul className="emojisList">
            <li onClick={() => onInsertMarkdown(EMOJI_SMILEY_FACE)}>
                <Parser>{emojis[EMOJI_SMILEY_FACE]}</Parser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_SAD_FACE)}>
                <Parser>{emojis[EMOJI_SAD_FACE]}</Parser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_THUMBS_UP)}>
                <Parser>{emojis[EMOJI_THUMBS_UP]}</Parser>
            </li>
            <li onClick={() => onInsertMarkdown(EMOJI_THUMBS_DOWN)}>
                <Parser>{emojis[EMOJI_THUMBS_DOWN]}</Parser>
            </li>
        </ul>
        <style jsx>{emojisPopoverClasses}</style>
    </Popover>
)

EmojisPopover.propTypes = {
    onClose: PropTypes.func.isRequired,
    onInsertMarkdown: PropTypes.func.isRequired,
    reference: PropTypes.object,
}

const IconButtonWithTooltip = ({ tooltipContent, disabled, icon, onClick }) => (
    <>
        <Tooltip content={tooltipContent} placement="bottom" closeDelay={200}>
            {({ ref, onMouseOver, onMouseOut }) => (
                <span
                    ref={ref}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                    className="tooltip"
                >
                    <Button
                        secondary
                        small
                        disabled={disabled}
                        icon={icon}
                        onClick={onClick}
                    />
                </span>
            )}
        </Tooltip>
        <style jsx>{tooltipAnchorClasses}</style>
    </>
)

IconButtonWithTooltip.propTypes = {
    disabled: PropTypes.bool,
    icon: PropTypes.node,
    tooltipContent: PropTypes.string,
    onClick: PropTypes.func,
}

const Toolbar = ({
    disabled,
    onInsertMarkdown,
    onTogglePreview,
    previewButtonDisabled,
    previewMode,
}) => {
    const emojisButtonRef = useRef()
    const [emojisPopoverIsOpen, setEmojisPopoverIsOpen] = useState(false)

    const iconColor = disabled ? colors.grey600 : colors.grey700

    return (
        <div className="toolbar">
            {!previewMode ? (
                <div className="actionsWrapper">
                    <div className="mainActions">
                        <IconButtonWithTooltip
                            tooltipContent={i18n.t('Bold text')}
                            disabled={disabled}
                            icon={<IconTextBold24 color={iconColor} />}
                            onClick={() => onInsertMarkdown(BOLD)}
                        />
                        <IconButtonWithTooltip
                            tooltipContent={i18n.t('Italic text')}
                            disabled={disabled}
                            icon={<IconTextItalic24 color={iconColor} />}
                            onClick={() => onInsertMarkdown(ITALIC)}
                        />
                        <IconButtonWithTooltip
                            tooltipContent={i18n.t('Link to a URL')}
                            disabled={disabled}
                            icon={<IconLink24 color={iconColor} />}
                            onClick={() => onInsertMarkdown(LINK)}
                        />
                        <IconButtonWithTooltip
                            tooltipContent={i18n.t('Mention a user')}
                            disabled={disabled}
                            icon={<IconAt24 color={iconColor} />}
                            onClick={() => onInsertMarkdown(MENTION)}
                        />
                        <span ref={emojisButtonRef} className="tooltip">
                            <IconButtonWithTooltip
                                tooltipContent={i18n.t('Add emoji')}
                                disabled={disabled}
                                icon={<IconFaceAdd24 color={iconColor} />}
                                onClick={() => setEmojisPopoverIsOpen(true)}
                            />
                        </span>
                        {emojisPopoverIsOpen && (
                            <EmojisPopover
                                onClose={() => setEmojisPopoverIsOpen(false)}
                                onInsertMarkdown={(markup) => {
                                    onInsertMarkdown(markup)
                                    setEmojisPopoverIsOpen(false)
                                }}
                                reference={emojisButtonRef}
                            />
                        )}
                    </div>

                    <div className="sideActions">
                        <Button
                            secondary
                            small
                            disabled={previewButtonDisabled || disabled}
                            onClick={onTogglePreview}
                        >
                            {i18n.t('Preview')}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="previewWrapper">
                    <Button
                        secondary
                        small
                        onClick={onTogglePreview}
                        disabled={disabled}
                    >
                        {i18n.t('Back to write mode')}
                    </Button>
                </div>
            )}
            <style jsx>{tooltipAnchorClasses}</style>
            <style jsx>{toolbarClasses}</style>
        </div>
    )
}

Toolbar.propTypes = {
    previewButtonDisabled: PropTypes.bool.isRequired,
    previewMode: PropTypes.bool.isRequired,
    onInsertMarkdown: PropTypes.func.isRequired,
    onTogglePreview: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
}

export const Editor = forwardRef(
    (
        {
            value,
            disabled,
            inputPlaceholder,
            onChange,
            errorText,
            helpText,
            initialFocus,
            resizable,
        },
        externalRef
    ) => {
        const [previewMode, setPreviewMode] = useState(false)
        const internalRef = useRef()
        const textareaRef = externalRef || internalRef
        const caretPosRef = useRef(undefined)

        const insertMarkdownCallback = (text, caretPos) => {
            caretPosRef.current = caretPos
            onChange(text)
            textareaRef.current.focus()
        }

        useEffect(() => {
            if (initialFocus) {
                textareaRef.current?.focus()
            }
        }, [initialFocus, textareaRef])

        useEffect(() => {
            if (caretPosRef.current) {
                textareaRef.current?.setSelectionRange(
                    caretPosRef.current,
                    caretPosRef.current
                )

                caretPosRef.current = undefined
            }
        }, [value, textareaRef])

        return (
            <div
                className="container"
                data-test="@dhis2-analytics-richtexteditor"
            >
                <Toolbar
                    onInsertMarkdown={(markdown) => {
                        insertMarkdown(
                            markdown,
                            textareaRef.current,
                            insertMarkdownCallback
                        )

                        if (markdown === MENTION) {
                            textareaRef.current.dispatchEvent(
                                new KeyboardEvent('keydown', {
                                    key: '@',
                                    bubbles: true,
                                })
                            )
                        }
                    }}
                    onTogglePreview={() => setPreviewMode(!previewMode)}
                    previewMode={previewMode}
                    previewButtonDisabled={!value}
                    disabled={disabled}
                />
                {previewMode ? (
                    <div className="preview">
                        <Parser>{value}</Parser>
                    </div>
                ) : (
                    <div className="edit">
                        <UserMentionWrapper
                            onUserSelect={onChange}
                            inputReference={textareaRef}
                        >
                            <textarea
                                className={cx('textarea', {
                                    resizable,
                                })}
                                ref={textareaRef}
                                placeholder={inputPlaceholder}
                                disabled={disabled}
                                value={value}
                                onChange={(event) =>
                                    onChange(event.target.value)
                                }
                                onKeyDown={(event) =>
                                    convertCtrlKey(
                                        event,
                                        insertMarkdownCallback
                                    )
                                }
                            />
                        </UserMentionWrapper>
                        {errorText && (
                            <Help error={!!errorText}>{errorText}</Help>
                        )}
                        {helpText && <Help>{helpText}</Help>}
                    </div>
                )}
                <style jsx>{mainClasses}</style>
            </div>
        )
    }
)

Editor.displayName = 'Editor'

Editor.defaultProps = {
    initialFocus: true,
    resizable: true,
}

Editor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    helpText: PropTypes.string,
    initialFocus: PropTypes.bool,
    inputPlaceholder: PropTypes.string,
    resizable: PropTypes.bool,
}
