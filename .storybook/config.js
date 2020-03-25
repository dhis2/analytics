import { configure } from '@storybook/react'

import 'typeface-roboto'

// automatically import all files ending in *.stories.js
const req = require.context('../src/__demo__', true, /\.stories\.js$/)

function loadStories() {
    req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
