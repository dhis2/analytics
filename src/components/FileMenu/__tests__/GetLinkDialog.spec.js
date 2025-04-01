import { Button, Modal } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { GetLinkDialog } from '../GetLinkDialog.js'

const testBaseUrl = 'http://host.tld/test/'

const mockUseConfig = jest.fn(() => ({ apiVersion: 42, baseUrl: testBaseUrl }))

jest.mock('@dhis2/app-runtime', () => ({
    useConfig: () => mockUseConfig(),
}))

const tests = [
    {
        type: 'visualization',
        baseUrl: 'http://host.tld',
        id: 'dv-id-1',
        expected: 'http://host.tld/dhis-web-data-visualizer/#/dv-id-1',
    },
    {
        type: 'visualization',
        baseUrl: testBaseUrl,
        id: 'dv-id-2',
        expected: 'http://host.tld/test/dhis-web-data-visualizer/#/dv-id-2',
    },
    {
        type: 'eventVisualization',
        baseUrl: 'http://host.tld/other-path/',
        id: 'll-id-1',
        expected: 'http://host.tld/other-path/dhis-web-line-listing/#/ll-id-1',
    },
    {
        type: 'eventVisualization',
        apiVersion: 41,
        baseUrl: 'http://host.tld/other-path',
        id: 'll-id-2',
        expected: 'http://host.tld/other-path/api/apps/line-listing/#/ll-id-2',
    },
    {
        type: 'map',
        baseUrl: testBaseUrl,
        id: 'map-id-1',
        expected: 'http://host.tld/test/dhis-web-maps/#/map-id-1',
    },
    {
        type: 'map',
        baseUrl: '../',
        id: 'map-id-2',
        expected: 'http://localhost/dhis-web-maps/#/map-id-2',
    },
]

describe('The FileMenu - GetLinkDialog component', () => {
    let shallowGetLinkDialog

    const onClose = jest.fn()

    const getGetLinkDialogComponent = (props) => {
        if (!shallowGetLinkDialog) {
            shallowGetLinkDialog = shallow(<GetLinkDialog {...props} />)
        }
        return shallowGetLinkDialog
    }

    beforeEach(() => {
        shallowGetLinkDialog = undefined
    })

    it('renders a Modal component', () => {
        expect(
            getGetLinkDialogComponent({
                type: tests[0].type,
                id: tests[0].id,
            }).find(Modal)
        ).toHaveLength(1)
    })

    test.each(tests)(
        'renders a <a> tag containing the correct app path and id',
        ({ apiVersion, baseUrl, type, id, expected }) => {
            mockUseConfig.mockReturnValueOnce({
                apiVersion: apiVersion || 42,
                baseUrl,
            })

            const href = getGetLinkDialogComponent({
                type,
                id,
                onClose,
            })
                .find('a')
                .prop('href')

            expect(href).toMatch(expected)
        }
    )

    it('calls the onClose callback when the Close button is clicked', () => {
        getGetLinkDialogComponent({
            type: tests[0].type,
            id: tests[0].id,
            onClose,
        })
            .find(Button)
            .at(1)
            .simulate('click')

        expect(onClose).toHaveBeenCalled()
    })
})
