import { shallow } from 'enzyme'
import React from 'react'
import { Parser } from '../Parser.jsx'

jest.mock('../MdParser.js', () => ({
    MdParser: jest.fn().mockImplementation(() => {
        return { render: () => 'converted text' }
    }),
}))

describe('RichText: Parser component', () => {
    let richTextParser
    const defaultProps = {
        style: { color: 'blue', whiteSpace: 'pre-line' },
    }

    const renderComponent = (props, text) => {
        return shallow(<Parser {...props}>{text}</Parser>)
    }

    it('should have rendered a result', () => {
        richTextParser = renderComponent({}, 'test')

        expect(richTextParser).toHaveLength(1)
    })

    it('should have rendered a result with the style prop', () => {
        richTextParser = renderComponent(defaultProps, 'test prop')

        expect(richTextParser.props().style).toEqual(defaultProps.style)
    })

    it('should have rendered content', () => {
        richTextParser = renderComponent({}, 'plain text')

        expect(richTextParser.html()).toEqual('<div>converted text</div>')
    })

    it('should return null if no children is passed', () => {
        richTextParser = renderComponent({}, undefined)
        expect(richTextParser.html()).toBe(null)
    })
})
