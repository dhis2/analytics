import React from 'react'
import PropTypes from 'prop-types'

const ItemIcon = ({ backgroundColor }) => {
    return (
        <div>
            <style jsx>{`
                div {
                    background-color: ${backgroundColor};
                    min-height: 6px;
                    min-width: 6px;
                    margin: 0px 5px;
                }
            `}</style>
        </div>
    )
}

ItemIcon.propTypes = {
    backgroundColor: PropTypes.string,
}

export default ItemIcon
