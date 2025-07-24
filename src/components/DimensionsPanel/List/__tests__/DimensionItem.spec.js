import { render } from '@testing-library/react'
import React from 'react'
import DimensionItem from '../DimensionItem.js'

const props = {
    id: 'pe',
    name: 'Period',
    isDeactivated: false,
    isSelected: false,
    isRecommended: false,
    isLocked: false,
}

test('DimensionItem matches the snapshot', () => {
    const { container } = render(<DimensionItem {...props} />)
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with recommended', () => {
    props.isRecommended = true

    const { container } = render(<DimensionItem {...props} />)
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with selected', () => {
    props.isSelected = true

    const { container } = render(<DimensionItem {...props} />)
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with locked', () => {
    props.isLocked = true

    const { container } = render(<DimensionItem {...props} />)
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with onOptionsClick', () => {
    props.onOptionsClick = jest.fn()

    const { container } = render(<DimensionItem {...props} />)
    expect(container).toMatchSnapshot()
})
