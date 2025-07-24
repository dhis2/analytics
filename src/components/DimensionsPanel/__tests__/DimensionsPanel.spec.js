import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import DimensionsPanel from '../DimensionsPanel.js'

const props = {
    dimensions: [
        { id: 'id1', name: 'Dimension 1' },
        { id: 'id2', name: 'Dimension 2' },
    ],
}

test('DimensionsPanel matches the snapshot', () => {
    const { container } = render(<DimensionsPanel {...props} />)

    expect(container).toMatchSnapshot()
})

test('DimensionsPanel renders a DimensionList component', () => {
    render(<DimensionsPanel {...props} />)

    const dimensionListComponent = screen.getByTestId('dimension-list')
    expect(dimensionListComponent).toBeInTheDocument()

    const liElements = screen.getAllByTestId('dimension-item')

    expect(liElements).toHaveLength(2)

    const dim1Element = screen.getByText(props.dimensions[0].name)
    expect(dim1Element).toBeInTheDocument()

    const dim2Element = screen.getByText(props.dimensions[1].name)
    expect(dim2Element).toBeInTheDocument()
})

test('DimensionsPanel can filter the dimension list', async () => {
    const user = userEvent.setup()

    render(<DimensionsPanel {...props} />)

    const filterComponent = screen.getByPlaceholderText('Filter dimensions')
    expect(filterComponent).toBeInTheDocument()

    await user.click(filterComponent)
    await user.keyboard('1')

    const liElements = screen.getAllByTestId('dimension-item')

    expect(liElements).toHaveLength(1)

    const dim1Element = screen.getByText(props.dimensions[0].name)
    expect(dim1Element).toBeInTheDocument()

    const dim2Element = screen.queryByText(props.dimensions[1].name)
    expect(dim2Element).not.toBeInTheDocument()
})
