import { useDhis2ConnectionStatus } from '@dhis2/app-runtime'
// import i18n from '@dhis2/d2-i18n'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { OfflineTooltip } from '../OfflineTooltip.js'

jest.mock('@dhis2/app-runtime', () => ({
    useDhis2ConnectionStatus: jest.fn(),
}))

const mockUseDhis2ConnectionStatus = (isDisconnected) => {
    useDhis2ConnectionStatus.mockReturnValue({ isDisconnected })
}

describe('OfflineTooltip', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('renders children without tooltip when online and not disabled', () => {
        mockUseDhis2ConnectionStatus(false)

        render(
            <OfflineTooltip disabledWhenOffline={true} disabled={false}>
                <span>Test Child</span>
            </OfflineTooltip>
        )

        expect(screen.getByText('Test Child')).toBeInTheDocument()
        expect(
            screen.queryByText('Not available offline')
        ).not.toBeInTheDocument()
    })

    test.only('shows tooltip when offline and disabledWhenOffline is true', () => {
        mockUseDhis2ConnectionStatus(true)

        const { container } = render(
            <OfflineTooltip disabledWhenOffline={true} disabled={false}>
                <span>Test Child</span>
            </OfflineTooltip>
        )

        expect(container).toMatchSnapshot()

        // const childElement = screen.getByText('Test Child')
        // fireEvent.mouseOver(childElement)

        // expect(screen.getByText('Not available offline')).toBeInTheDocument()
    })

    test('shows custom tooltip content', () => {
        mockUseDhis2ConnectionStatus(true)

        render(
            <OfflineTooltip
                disabledWhenOffline={true}
                disabled={false}
                content="Custom Tooltip Content"
            >
                <span>Test Child</span>
            </OfflineTooltip>
        )

        const childElement = screen.getByText('Test Child')
        fireEvent.mouseOver(childElement)

        expect(screen.getByText('Custom Tooltip Content')).toBeInTheDocument()
    })

    test('shows tooltip when disabled is true', () => {
        mockUseDhis2ConnectionStatus(false)

        render(
            <OfflineTooltip disabledWhenOffline={false} disabled={true}>
                <span>Test Child</span>
            </OfflineTooltip>
        )

        const childElement = screen.getByText('Test Child')
        fireEvent.mouseOver(childElement)

        expect(screen.getByText('Not available offline')).toBeInTheDocument()
    })

    test('does not show tooltip when disabledWhenOffline and disabled are false', () => {
        mockUseDhis2ConnectionStatus(true)

        render(
            <OfflineTooltip disabledWhenOffline={false} disabled={false}>
                <span>Test Child</span>
            </OfflineTooltip>
        )

        const childElement = screen.getByText('Test Child')
        fireEvent.mouseOver(childElement)

        expect(
            screen.queryByText('Not available offline')
        ).not.toBeInTheDocument()
    })
})
