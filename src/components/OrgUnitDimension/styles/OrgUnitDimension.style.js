import { colors, spacers } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .orgUnitTreeWrapper {
        height: 418px;
        flex-grow: 1;
        overflow: auto;
    }

    .orgUnitTreeWrapper > :global(*) {
        flex-grow: 1;
    }

    .disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }

    .disabled > :global(*) {
        pointer-events: none;
    }

    .userOrgUnitsWrapper {
        display: flex;
        background: ${colors.grey200};
        padding: ${spacers.dp8} ${spacers.dp8} ${spacers.dp8} ${spacers.dp24};
        margin-bottom: ${spacers.dp12};
    }

    .userOrgUnitsWrapper > :global(*) {
        margin-right: ${spacers.dp48};
    }

    .selectsWrapper {
        display: flex;
        gap: ${spacers.dp12};
        margin-top: ${spacers.dp12};
    }

    .selectsWrapper > :global(*) {
        width: 33%;
    }
`
