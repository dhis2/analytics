import { render, screen } from '@testing-library/react'
import React from 'react'
import { ToolbarSidebar } from '../index.js'

describe('<ToolbarSidebar/>', () => {
    test('renders children', () => {
        const childNode = 'text node'
        render(<ToolbarSidebar>{childNode}</ToolbarSidebar>)

        expect(screen.getByText(childNode)).toBeInTheDocument()
    })

    test('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        render(<ToolbarSidebar dataTest={dataTest} />)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    test('accepts a `isHidden` prop', () => {
        const { container } = render(<ToolbarSidebar isHidden />)
        const divEl = container.querySelector('div')

        expect(divEl).toHaveClass('isHidden')
    })
})
