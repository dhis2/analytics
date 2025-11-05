import { render, screen } from '@testing-library/react'
import React from 'react'
import { Toolbar } from '../index.js'

describe('<Toolbar/>', () => {
    test('renders children', () => {
        const childNode = 'text node'

        render(<Toolbar>{childNode}</Toolbar>)

        expect(screen.getByText(childNode)).toBeInTheDocument()
    })

    test('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        render(<Toolbar dataTest={dataTest} />)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })
})
