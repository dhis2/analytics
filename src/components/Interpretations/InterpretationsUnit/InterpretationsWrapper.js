import PropTypes from 'prop-types'
import React from 'react'
import { InterpretationReplyForm } from '../common/Interpretation/InterpretationReplyForm.js'
import { InterpretationsUnit } from './InterpretationsUnit.js'

export const InterpretationsWrapper = (props) => {
    console.log('props', props)
    if (props.inlineReply && props.interpretationId) {
        return <InterpretationReplyForm {...props} />
    }

    return <InterpretationsUnit {...props} />
}

InterpretationsWrapper.propTypes = {
    inlineReply: PropTypes.bool,
    interpretationId: PropTypes.string,
}
