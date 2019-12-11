import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import ItemIcon from './ItemIcon'
import { colors } from '../styles/colors'
import styles from './styles/UnselectedItem.style'

const onClickWrapper = ({ id, index, onClick }) => event =>
    onClick({
        isCtrlPressed: event.metaKey || event.ctrlKey,
        isShiftPressed: event.shiftKey,
        index,
        id,
    })

export const Item = ({ name, highlighted, ...rest }) => {
    return (
        <div
            className={cx('item', {
                'highlighted-item': highlighted,
                'unselected-item': !highlighted,
            })}
            onClick={onClickWrapper(rest)}
            data-test={`dimension-item-${rest.id}`}
        >
            <ItemIcon backgroundColor={colors.grey} />
            <span
                className={cx('item-label', {
                    'highlighted-text': highlighted,
                })}
            >
                {name}
            </span>
            <style jsx>{styles}</style>
        </div>
    )
}

Item.defualtProps = {
    onClick: () => null,
}

Item.propTypes = {
    highlighted: PropTypes.bool.isRequired,
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    onClick: PropTypes.func,
}

export default Item
