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
    const { container } = render(
        <DimensionItem {...props} isRecommended={true} />
    )
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with selected', () => {
    const { container } = render(<DimensionItem {...props} isSelected={true} />)
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with locked', () => {
    const { container } = render(<DimensionItem {...props} isLocked={true} />)
    expect(container).toMatchSnapshot()
})

test('DimensionItem matches the snapshot with onOptionsClick', () => {
    const { container } = render(
        <DimensionItem {...props} onOptionsClick={jest.fn()} />
    )
    expect(container).toMatchSnapshot()
})
