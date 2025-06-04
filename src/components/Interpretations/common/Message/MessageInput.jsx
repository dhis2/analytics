import { theme, colors } from '@dhis2/ui'
import React, { forwardRef } from 'react'

const MessageInput = forwardRef((props, ref) => (
    <>
        <input ref={ref} className="input" {...props} />
        <style jsx>{`
            .input {
                width: 100%;
                box-sizing: border-box;
                font-size: 14px;
                line-height: 16px;
                user-select: text;
                color: ${colors.grey900};
                background-color: white;
                padding: 12px 11px 10px;
                outline: 0;
                border: 1px solid ${colors.grey500};
                border-radius: 3px;
                box-shadow: inset 0 1px 2px 0 rgba(48, 54, 60, 0.1);
                text-overflow: ellipsis;
            }

            input:focus {
                outline: none;
                box-shadow: 0 0 0 3px ${theme.focus};
            }

            input.disabled {
                background-color: ${colors.grey100};
                border-color: ${colors.grey500};
                color: ${theme.disabled};
                cursor: not-allowed;
            }
        `}</style>
    </>
))

MessageInput.displayName = 'MessageInput'

export { MessageInput }
