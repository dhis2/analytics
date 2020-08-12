import 'typeface-roboto'
import React, { Fragment } from 'react'
import { configure, addDecorator } from '@storybook/react'
import { CssReset } from '@dhis2/ui-core'

// automatically import all files ending in *.stories.js
const req = require.context('../src/__demo__', true, /\.stories\.js$/)

function loadStories() {
    req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)

addDecorator(fn => (
    <Fragment>
        <CssReset />
        {fn()}
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
    </Fragment>
))
