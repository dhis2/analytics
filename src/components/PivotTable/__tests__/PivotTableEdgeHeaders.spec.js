import { render } from '@testing-library/react'
import React from 'react'
import deepData from '../../../__demo__/data/aggregate/deep.data.json'
import deepVisualization from '../../../__demo__/data/aggregate/deep.visualization.json'
import PivotTable from '../PivotTable.js'

/* The engine measures every cell against a canvas 2d context, which jsdom
 * does not implement. */
jest.mock('../../../modules/pivotTable/measureText.js', () => ({
    measureTextWithWrapping: () => ({ width: 100, height: 20 }),
}))

/* The container renders nothing at all until it has a size, and jsdom reports
 * every element as 0 x 0. */
jest.mock('../../../modules/pivotTable/useParentSize.js', () => ({
    useParentSize: () => ({ width: 800, height: 600 }),
}))

/* A fixed header carries the border of the edge it sticks to, and the styles
 * find those headers by these two classes. jsdom does not apply the styles, so
 * the classes are as far as a unit test can see. `deep` has two row dimensions
 * and three column dimensions. */
const TOP_EDGE = 'top-edge-header'
const LEFT_EDGE = 'left-edge-header'

const renderRows = () => {
    const { container } = render(
        <PivotTable
            visualization={{ ...deepVisualization, title: 'Hello' }}
            data={deepData}
        />
    )
    const headRows = [...container.querySelectorAll('thead tr')]
    const isTitleRow = (row) => row.querySelector('th.title-cell') !== null

    return {
        titleRows: headRows.filter(isTitleRow),
        columnHeaderRows: headRows.filter((row) => !isTitleRow(row)),
        bodyRows: [...container.querySelectorAll('tbody tr')],
    }
}

const headerCells = (row) => [...row.querySelectorAll('th')]

describe('PivotTable edge headers', () => {
    it('marks every header in the first column header row as top edge', () => {
        const { columnHeaderRows } = renderRows()

        const firstRowCells = headerCells(columnHeaderRows[0])
        expect(firstRowCells.length).toBeGreaterThan(1)
        firstRowCells.forEach((cell) => expect(cell).toHaveClass(TOP_EDGE))
    })

    it('marks no header below the first column header row as top edge', () => {
        const { columnHeaderRows } = renderRows()

        const lowerRowCells = columnHeaderRows.slice(1).flatMap(headerCells)
        expect(lowerRowCells.length).toBeGreaterThan(0)
        lowerRowCells.forEach((cell) => expect(cell).not.toHaveClass(TOP_EDGE))
    })

    it('marks the corner cell as left edge and no column header', () => {
        const { columnHeaderRows } = renderRows()

        const [cornerCell, ...columnHeaders] = headerCells(columnHeaderRows[0])
        expect(cornerCell).toHaveClass(LEFT_EDGE)
        columnHeaders.forEach((cell) => expect(cell).not.toHaveClass(LEFT_EDGE))
    })

    it('marks only the outermost row header as left edge', () => {
        const { bodyRows } = renderRows()

        const [outerHeader, innerHeader] = headerCells(bodyRows[0])
        expect(outerHeader).toHaveClass(LEFT_EDGE)
        expect(innerHeader).not.toHaveClass(LEFT_EDGE)
    })

    it('marks no inner row header as left edge where the outer one spans rows', () => {
        const { bodyRows } = renderRows()

        /* A row that stands in for the rows scrolled out of view also has a
         * single header, but that one spans every row header column. */
        const rowsUnderASpan = bodyRows.filter((row) => {
            const cells = headerCells(row)
            return cells.length === 1 && cells[0].colSpan === 1
        })
        expect(rowsUnderASpan.length).toBeGreaterThan(0)
        rowsUnderASpan
            .flatMap(headerCells)
            .forEach((cell) => expect(cell).not.toHaveClass(LEFT_EDGE))
    })

    it('puts the title content directly in the title cell, where it carries the left border', () => {
        const { titleRows } = renderRows()

        expect(titleRows).toHaveLength(1)
        const [titleCell] = headerCells(titleRows[0])
        expect(
            titleCell.querySelector(':scope > .title-cell-content')
        ).toHaveTextContent('Hello')
    })

    it('marks no row header as top edge', () => {
        const { bodyRows } = renderRows()

        bodyRows
            .flatMap(headerCells)
            .forEach((cell) => expect(cell).not.toHaveClass(TOP_EDGE))
    })
})
