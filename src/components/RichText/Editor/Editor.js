import PropTypes from 'prop-types'
import React, { Component } from 'react'
import convertCtrlKey from './convertCtrlKey.js'

class Editor extends Component {
    onKeyDown = (event) => {
        convertCtrlKey(event, this.props.onEdit)
    }

    render() {
        const { children } = this.props

        return <div onKeyDown={this.onKeyDown}>{children}</div>
    }
}

Editor.defaultProps = {
    onEdit: null,
}

Editor.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    onEdit: PropTypes.func,
}

export default Editor
