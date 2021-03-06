import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import ItemIcon from './ItemIcon'
import DeselectIconButton from './DeselectIconButton'
import { colors, theme } from '@dhis2/ui'
import styles from './styles/SelectedItem.style'

const onClickWrapper = ({ id, index, onClick }) => event =>
    onClick({
        isCtrlPressed: event.metaKey || event.ctrlKey,
        isShiftPressed: event.shiftKey,
        index,
        id,
    })

export const Item = ({
    name,
    highlighted,
    ghost,
    active,
    onRemoveItem,
    ...rest
}) => {
    return (
        <div
            className={cx('item', {
                'highlighted-item': highlighted,
                ghost,
                'selected-item': !highlighted,
                'inactive-item': !active,
            })}
            onClick={onClickWrapper(rest)}
            data-test={`dimension-item-${rest.id}`}
        >
            <ItemIcon
                backgroundColor={
                    highlighted ? colors.white : theme.secondary600
                }
            />
            <span
                className={cx('item-label', {
                    'highlighted-text': highlighted,
                })}
            >
                {name}
            </span>
            <DeselectIconButton
                fill={highlighted ? colors.white : theme.secondary600}
                onClick={() => onRemoveItem(rest.id)}
            />
            <style jsx>{styles}</style>
        </div>
    )
}

Item.defaultProps = {
    active: true,
    onRemoveItem: () => null,
    onClick: () => null,
}

Item.propTypes = {
    highlighted: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    active: PropTypes.bool,
    ghost: PropTypes.bool,
    onClick: PropTypes.func,
    onRemoveItem: PropTypes.func,
}

export default Item
