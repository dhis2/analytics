import { render } from '@testing-library/react'
import React from 'react'
import FixedPeriodSelect from '../FixedPeriodSelect.js'

test('FixedPeriodSingleSelect matches the snapshot', () => {
    const props = {
        value: '201405',
        onChange: () => {},
    }

    const { container } = render(<FixedPeriodSelect {...props} />)

    expect(container).toMatchSnapshot()
})
