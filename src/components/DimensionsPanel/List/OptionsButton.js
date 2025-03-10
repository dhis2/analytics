import { IconMore16 } from '@dhis2/ui'
import PropTypes from 'prop-types'
import React from 'react'

const OptionsButton = ({ onClick }) => (
    <>
        <button onClick={onClick}>
            <IconMore16 />
        </button>
        <style jsx>
            {`
                button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: 20px;
                    padding: 0;
                    border: none;
                    background: none;
                    outline: none;
                    cursor: pointer;
                    border-top-right-radius: 2px;
                    border-bottom-left-radius: 2px;
                }
                button:hover {
                    background-color: rgba(33, 41, 52, 0.08);
                }
                button:active {
                    background-color: rgba(33, 41, 52, 0.13);
            `}
        </style>
    </>
)

OptionsButton.propTypes = {
    onClick: PropTypes.func,
}

export default OptionsButton
