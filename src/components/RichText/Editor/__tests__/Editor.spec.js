import { shallow } from 'enzyme'
import React from 'react'
import { Editor } from '../Editor.js'

const mockConvertCtrlKey = jest.fn()
jest.mock('../markdownHandler.js', () => ({
    convertCtrlKey: () => mockConvertCtrlKey(),
}))

describe('RichText: Editor component', () => {
    let richTextEditor

    const componentProps = {
        value: '',
        onChange: jest.fn(),
    }

    beforeEach(() => {
        mockConvertCtrlKey.mockClear()
    })

    const renderComponent = (props) => {
        return shallow(<Editor {...props} />)
    }

    it('renders a result', () => {
        richTextEditor = renderComponent(componentProps)

        expect(richTextEditor).toHaveLength(1)
    })

    it('calls convertCtrlKey on keydown', () => {
        renderComponent(componentProps).find('textarea').simulate('keyDown')
        expect(mockConvertCtrlKey).toHaveBeenCalled()
    })
})
