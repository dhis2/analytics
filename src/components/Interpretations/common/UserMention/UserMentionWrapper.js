import i18n from '@dhis2/d2-i18n'
import {
    CenteredContent,
    CircularLoader,
    Menu,
    MenuSectionHeader,
    MenuItem,
    Popper,
    Card,
    Portal,
} from '@dhis2/ui'
import PropTypes from 'prop-types'
import React, { useState, useRef } from 'react'
import {
    resolvedHeaderStyle,
    userMentionWrapperClasses,
} from './styles/UserMentionWrapper.style.js'
import { UserList } from './UserList.js'
import { useUserSearchResults } from './useUserSearchResults.js'

const AT_SYMBOL_WIDTH = 14

const getVirtualPopperReference = (ref) => {
    const rects = ref.current.getClientRects()
    const lastRect = rects[rects.length - 1]
    const left = lastRect.left + lastRect.width - AT_SYMBOL_WIDTH

    return {
        getBoundingClientRect: () => ({
            top: lastRect.top,
            right: lastRect.right,
            bottom: lastRect.bottom,
            left,
            width: AT_SYMBOL_WIDTH,
            height: lastRect.height,
            x: left,
        }),
    }
}

export const UserMentionWrapper = ({
    children,
    inputReference,
    onUserSelect,
}) => {
    const [captureText, setCaptureText] = useState(false)
    const [capturedText, setCapturedText] = useState('')
    const [cloneText, setCloneText] = useState('')
    const cloneRef = useRef(null)
    const [captureStartPosition, setCaptureStartPosition] = useState(null)
    const [selectedUserIndex, setSelectedUserIndex] = useState(0)
    const { users, pager, fetching, clear } = useUserSearchResults({
        searchText: capturedText,
    })

    const reset = () => {
        setCaptureText(false)
        setCapturedText('')
        setCloneText('')
        setCaptureStartPosition(null)
        setSelectedUserIndex(0)

        clear()
    }

    // event bubbles up from the input/textarea
    const onInput = ({ target }) => {
        const { selectionEnd, value } = target

        if (captureText) {
            clear()

            const spacePosition = value.indexOf(' ', captureStartPosition - 1)

            const filterValue = value.substring(
                captureStartPosition,
                spacePosition > 0 ? spacePosition : selectionEnd + 1
            )

            if (filterValue !== capturedText) {
                setCapturedText(filterValue)
            } else if (filterValue.length === 0) {
                setCapturedText('')
                clear()
            }
        }
    }

    // event bubbles up from the wrapped input/textarea
    const onKeyDown = ({ key, target }) => {
        const { selectionStart } = target

        if (!captureText && key === '@') {
            setCaptureText(true)
            setCaptureStartPosition(selectionStart + 1)
            setCloneText(target.value.substring(0, selectionStart) + '@')
        } else if (captureText) {
            if (
                key === ' ' ||
                (key === 'Backspace' && selectionStart <= captureStartPosition)
            ) {
                reset()
            } else if (users.length) {
                switch (key) {
                    case 'Enter':
                        event.preventDefault()
                        if (selectedUserIndex >= 0) {
                            onSelect(users[selectedUserIndex])
                        }
                        break
                    case 'ArrowDown':
                        event.preventDefault()

                        if (selectedUserIndex < users.length - 1) {
                            setSelectedUserIndex(selectedUserIndex + 1)
                        }

                        break
                    case 'ArrowUp':
                        event.preventDefault()

                        if (selectedUserIndex > 0) {
                            setSelectedUserIndex(selectedUserIndex - 1)
                        }

                        break
                    default:
                    // other key strokes, typically the text typed
                    // the onInput event handler set on the input element is triggering the user lookup
                }
            }
        }
    }

    const onSelect = (user) => {
        const originalValue = inputReference.current.value
        const newValue = `${originalValue.slice(
            0,
            captureStartPosition - 1
        )}${originalValue
            .slice(captureStartPosition - 1)
            .replace(/^@\w*/, `@${user.username} `)}`

        reset()

        // typically for connected components we want the state to be updated too
        // but the logic belongs to the wrapped component, so we just invoke the supplied callback
        if (onUserSelect) {
            onUserSelect(newValue)
        }

        // need to refocus on the input/textarea
        inputReference.current.focus()

        // position the cursor at the end
        requestAnimationFrame(
            () => inputReference.current.setSelectionRange(-1, -1),
            0
        )
    }

    const onClick = (user) => () => onSelect(user)

    return (
        <div onKeyDown={onKeyDown} onInput={onInput} className="wrapper">
            {children}
            <div className="clone">
                <pre ref={cloneRef}>{cloneText}</pre>
            </div>
            {captureText && (
                <Portal>
                    <Popper
                        reference={getVirtualPopperReference(cloneRef)}
                        placement="top-start"
                    >
                        <Card>
                            <div className="container">
                                <Menu dense>
                                    <MenuSectionHeader
                                        className={
                                            resolvedHeaderStyle.className
                                        }
                                        dense
                                        hideDivider
                                        label={
                                            capturedText === ''
                                                ? i18n.t('Search for a user')
                                                : i18n.t(
                                                      'Searching for "{{searchText}}"',
                                                      {
                                                          searchText:
                                                              capturedText,
                                                      }
                                                  )
                                        }
                                    />
                                    {fetching && (
                                        <MenuItem
                                            label={
                                                <CenteredContent>
                                                    <CircularLoader small />
                                                </CenteredContent>
                                            }
                                        />
                                    )}
                                    {!fetching && users.length > 0 && (
                                        <UserList
                                            users={users}
                                            selectedUserIndex={
                                                selectedUserIndex
                                            }
                                            onUserClick={onClick}
                                            pager={pager}
                                        />
                                    )}
                                    {capturedText &&
                                        !fetching &&
                                        users.length === 0 && (
                                            <MenuItem
                                                dense
                                                disabled
                                                label={i18n.t(
                                                    'No results found'
                                                )}
                                            />
                                        )}
                                </Menu>
                            </div>
                        </Card>
                    </Popper>
                </Portal>
            )}
            <style jsx>{userMentionWrapperClasses}</style>
            {resolvedHeaderStyle.styles}
        </div>
    )
}

UserMentionWrapper.defaultProps = {
    onUserSelect: Function.prototype,
}

UserMentionWrapper.propTypes = {
    inputReference: PropTypes.object.isRequired,
    onUserSelect: PropTypes.func.isRequired,
    children: PropTypes.node,
}

export default UserMentionWrapper
