import PropTypes from 'prop-types'
import React, { useMemo } from 'react'
import { MdParser } from './MdParser.js'

export const Parser = ({ children, style }) => {
    const MdParserInstance = useMemo(() => new MdParser(), [])

    return children ? (
        <div
            style={{ ...style }}
            dangerouslySetInnerHTML={{
                __html: MdParserInstance.render(children),
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
