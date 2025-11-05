import { render, screen } from '@testing-library/react'
import React from 'react'
import { HoverMenuList, HoverMenuListItem } from '../index.js'

describe('<HoverMenuList/>', () => {
    const dataTest = 'test'
    const childNode = 'children'

    test('renders children', () => {
        render(<HoverMenuList>{childNode}</HoverMenuList>)
        expect(screen.getByText(childNode)).toBeInTheDocument()
    })

    test('accept a `className` prop', () => {
        const className = 'className'

        render(
            <HoverMenuList dataTest={dataTest} className={className}>
                {childNode}
            </HoverMenuList>
        )

        expect(screen.getByTestId(dataTest)).toHaveClass(className)
    })

    test('accepts a `dataTest` prop', () => {
        render(<HoverMenuList dataTest={dataTest}>{childNode}</HoverMenuList>)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    test('accept a `dense` prop', () => {
        render(
            <HoverMenuList dense>
                <HoverMenuListItem label="item 1" />
                <HoverMenuListItem label="item 2" />
            </HoverMenuList>
        )

        expect(screen.getByText('item 1').closest('li')).toHaveClass('dense')
        expect(screen.getByText('item 2').closest('li')).toHaveClass('dense')
    })

    test('accept a `maxHeight` prop', () => {
        const maxHeight = '100000px'

        const { container } = render(
            <HoverMenuList dataTest={dataTest} maxHeight={maxHeight}>
                {childNode}
            </HoverMenuList>
        )

        expect(container).toMatchSnapshot()
    })

    test('accept a `maxWidth` prop', () => {
        const maxWidth = '100000px'

        const { container } = render(
            <HoverMenuList dataTest={dataTest} maxWidth={maxWidth}>
                {childNode}
            </HoverMenuList>
        )
        expect(container).toMatchSnapshot()
    })
})
