import { CssReset } from '@dhis2/ui'
import React from 'react'

export const decorators = [
    Story => (
        <div>
            <CssReset />
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
