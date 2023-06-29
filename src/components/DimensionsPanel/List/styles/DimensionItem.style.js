import { colors, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export default css`
    .label {
        display: flex;
        outline: none;
        color: ${colors.grey900};
        user-select: none;
        word-break: break-word;
        font-size: 14px;
    }
    .label-wrapper {
        padding: 2px 5px 2px 0;
    }
    .item {
        display: flex;
        min-height: 24px;
        margin-top: 3px;
        margin-bottom: 3px;
        align-items: center;
        border-radius: 2px;
    }
    .item:hover {
        background-color: ${colors.grey200};
    }
    .item:active {
        background-color: ${colors.grey300};
    }
    .deactivated {
        color: ${colors.grey500};
    }
    .deactivated:hover {
        background-color: transparent;
        cursor: not-allowed;
    }
    .label-deactivated {
        color: ${colors.grey500};
    }
    .clickable {
        cursor: pointer;
    }
    .selected {
        background-color: ${theme.secondary100};
        font-weight: 500;
    }
    .selected:hover {
        background-color: ${theme.secondary200};
    }
    .fixed-dimension-icon {
        padding-left: 6px;
        padding-bottom: 2px;
    }
    .dynamic-dimension-icon {
        padding-left: 9px;
        padding-right: 9px;
    }
    .icon-wrapper {
        display: flex;
        flex-direction: column;
        padding: 3px 8px 0 8px;
    }
    .lock-wrapper {
        display: flex;
        align-items: center;
        color: ${colors.grey600};
    }
    .options-wrapper {
        position: relative;
        left: 5px;
        width: 20px;
        height: 20px;
    }
`
