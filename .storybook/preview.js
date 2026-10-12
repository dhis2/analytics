import { CssReset, CssVariables } from '@dhis2/ui'
import React from 'react'

export const decorators = [
    (Story) => (
        <div>
            <CssReset />
            <CssVariables spacers colors layers elevations theme />
            <Story />
            <style jsx>{`
                :global(html) {
                    height: 100%;
                }
                :global(body) {
                    height: 100%;
                    min-height: 100%;
                }
                :global(#root) {
                    height: 100%;
                    padding: 16px;
                }
            `}</style>
        </div>
    ),
]
//export const tags = ['autodocs', 'autodocs'];
