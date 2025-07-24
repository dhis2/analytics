import { render, screen } from '@testing-library/react'
import React from 'react'
import { HoverMenuListItem } from '../index.js'

describe('<HoverMenuListItem/>', () => {
    /* Some of the props for this component are included
     * in the mouse interaction tests for the HoverMenuBar.
     * Only the `className`, `dataTest`, `destructive` and
     * `icon` prop need to be verified here. */

    test('accepts a `className` prop', () => {
        const className = 'className'
        render(<HoverMenuListItem className={className} />)

        expect(
            screen.getByTestId('dhis2-uicore-hovermenulistitem')
        ).toHaveClass(className)
    })

    test('accepts a `dataTest` prop', () => {
        const dataTest = 'test'
        render(<HoverMenuListItem dataTest={dataTest} />)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    test('accepts a `destructive` prop', () => {
        const dataTest = 'test'
        render(<HoverMenuListItem dataTest={dataTest} destructive />)

        expect(screen.getByTestId(dataTest)).toBeInTheDocument()
    })

    test('accepts an `icon` prop', () => {
        const dataTest = 'test'
        const iconText = 'I am an icon'
        const icon = <span id="testicon">{iconText}</span>
        render(<HoverMenuListItem dataTest={dataTest} icon={icon} />)

        const iconWrapperEl = screen.getByTestId(dataTest).firstChild
        expect(iconWrapperEl).toBeInTheDocument()
        expect(iconWrapperEl).toHaveClass('icon')

        const iconEl = iconWrapperEl.closest('span')
        expect(iconEl).toHaveTextContent(iconText)
    })
})
