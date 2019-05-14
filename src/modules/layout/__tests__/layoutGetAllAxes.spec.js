import { layoutGetAllAxes } from '../layoutGetAllAxes'
import { TEST_LAYOUT, TEST_AXES_IN_LAYOUT } from '../testResources'

describe('layoutGetAllAxes', () => {
    it('should return all axes in the layout', () => {
        expect(layoutGetAllAxes(TEST_LAYOUT)).toEqual(TEST_AXES_IN_LAYOUT)
    })
})
