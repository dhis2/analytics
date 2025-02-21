import { colors } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .item {
        color: ${colors.grey900};
        background-color: transparent;
        fill: ${colors.grey800};
        display: flex;
        gap: 4px;
        outline: none;
        justify-content: space-between;
        padding: 0 0 0 4px;
        margin: 0;
        border-radius: 2px;
        cursor: pointer;
        min-height: 22px;
        border: 1px solid transparent;
    }

    .item:not(.deactivated):not(.dragging):hover {
        background-color: ${colors.grey100};
        border-color: ${colors.grey400};
    }

    .label {
        display: flex;
        align-items: center;
    }
    .labelWrapper {
        display: flex;
        padding: 2px 0;
    }
    .labelText {
        font-size: 13px;
        line-height: 15px;
        margin-top: 1px;
        align-self: center;
    }

    .iconWrapper {
        width: 16px;
        height: 16px;
        margin: 2px 4px 0 0;
        flex: 0 0 auto;
        align-self: flex-start;
    }

    .item.deactivated {
        opacity: 0.5;
        cursor: not-allowed;
    }
    .item.selected {
        background-color: ${colors.teal100};
        border: 1px solid ${colors.teal200};
        color: ${colors.teal900};
        fill: ${colors.teal800};
        font-weight: 400;
    }
    .item.selected:not(.deactivated):hover {
        background: #cdeae8;
        border-color: #93c4bf;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }

    .optionsWrapper {
        width: 20px;
        flex-shrink: 0;
        align-self: stretch;
    }

    .lockWrapper svg path {
        fill: ${colors.grey800};
    }

    .lockWrapper {
        background: ${colors.grey300};
        align-self: stretch;
        padding: 0 2px 0 3px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .item.selected .lockWrapper {
        background: #cbe7e5;
    }
    .item.selected .lockWrapper svg path {
        fill: ${colors.teal900};
    }
`
