import '@testing-library/jest-dom'
import { configure } from '@testing-library/dom'

configure({
    testIdAttribute: 'data-test',
})
