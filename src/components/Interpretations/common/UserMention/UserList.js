import { MenuItem } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'
import i18n from '../../../../locales/index.js'

export const UserList = ({ users, selectedUserIndex, onUserClick, pager }) => {
    return (
        <>
            {users.map((u) => (
                <MenuItem
                    dense
                    key={u.id}
                    onClick={onUserClick(u)}
                    label={`${u.displayName} (${u.username})`}
                    active={users[selectedUserIndex]?.id === u.id}
                />
            ))}
            {pager.total > pager.pageSize && (
                <MenuItem
                    dense
                    disabled
                    label={i18n.t('Too many results. Try refining the search.')}
                />
            )}
        </>
    )
}

UserList.propTypes = {
    pager: PropTypes.object.isRequired,
    selectedUserIndex: PropTypes.number.isRequired,
    users: PropTypes.array.isRequired,
    onUserClick: PropTypes.func.isRequired,
}
