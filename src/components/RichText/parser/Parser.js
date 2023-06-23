import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import MdParserClass from './MdParser.js'

const Parser = ({ children, style }) => {
    const MdParser = useMemo(() => new MdParserClass(), [])

    return children ? (
        <p
            style={style}
            dangerouslySetInnerHTML={{
                __html: MdParser.render(children),
            }}
        />
    ) : null
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
