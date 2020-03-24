import css from 'styled-jsx/css'
import { colors } from '@dhis2/ui-core'

export default css`
    button {
        padding: 5px 13px 3px;
        border: 1px solid ${colors.grey200};
        border-radius: 0;
        margin-right: -1px;
        font-size: 0.875rem;
        line-height: 1.75;
        font-weight: 500;
    }

    button:first-child {
        border-radius: 2px 0 0 2px;
    }

    button:last-child {
        border-radius: 0 2px 2px 0;
    }

    button:focus {
        outline: none;
    }

    button:hover {
        cursor: pointer;
    }

    button:not(.active):hover {
        background-color: ${colors.grey200};
    }

    button.active {
        background-color: ${colors.teal600};
        color: ${colors.white};
        cursor: pointer;
    }
`
