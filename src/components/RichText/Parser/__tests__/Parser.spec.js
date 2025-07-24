import { render, screen } from '@testing-library/react'
import React from 'react'
import { Parser } from '../Parser.js'

jest.mock('../MdParser.js', () => ({
    MdParser: jest.fn().mockImplementation(() => {
        return { render: () => 'converted text' }
    }),
}))

describe('RichText: Parser component', () => {
    const defaultProps = {
        style: { color: 'blue', whiteSpace: 'pre-line' },
    }

    const renderComponent = (props, text) => {
        return render(<Parser {...props}>{text}</Parser>)
    }

    test('should have rendered a result with the style prop', () => {
        const { container } = renderComponent(defaultProps, 'test prop')
        const divEl = container.querySelector('div')

        expect(divEl.style.color).toBe(defaultProps.style.color)
        expect(divEl.style.whiteSpace).toBe(defaultProps.style.whiteSpace)
    })

    test('should have rendered content', () => {
        renderComponent({}, 'plain text')

        expect(screen.getByText('converted text')).toBeInTheDocument()
    })

    test('should return null if no children is passed', () => {
        const { container } = renderComponent({}, undefined)
        const divEl = container.querySelector('div')

        expect(divEl).toBe(null)
    })
})
