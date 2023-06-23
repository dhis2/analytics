import PropTypes from 'prop-types'
import React, { Component } from 'react'
import MdParserClass from './MdParser.js'

class Parser extends Component {
    constructor(props) {
        super(props)

        this.MdParser = new MdParserClass()
    }

    render() {
        const { children, style } = this.props

        return children ? (
            <p
                style={style}
                dangerouslySetInnerHTML={{
                    __html: this.MdParser.render(children),
                }}
            />
        ) : null
    }
}

Parser.defaultProps = {
    style: null,
}

Parser.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
    ]),
    style: PropTypes.object,
}

export default Parser
