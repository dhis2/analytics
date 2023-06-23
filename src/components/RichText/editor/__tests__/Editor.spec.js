import { shallow } from 'enzyme'
import React from 'react'
import convertCtrlKey from '../convertCtrlKey.js'
import Editor from '../Editor.js'

jest.mock('../convertCtrlKey')

describe('RichText: Editor component', () => {
    let richTextEditor
    const componentProps = {
        onEdit: jest.fn(),
    }

    beforeEach(() => {
        convertCtrlKey.mockClear()
    })

    const renderComponent = (props) => {
        return shallow(
            <Editor {...props}>
                <input />
            </Editor>
        )
    }

    it('renders a result', () => {
        richTextEditor = renderComponent(componentProps)

        expect(richTextEditor).toHaveLength(1)
    })

    it('calls convertCtrlKey on keydown', () => {
        richTextEditor = renderComponent(componentProps)
        richTextEditor.simulate('keyDown')
        expect(convertCtrlKey).toHaveBeenCalled()
    })
})
