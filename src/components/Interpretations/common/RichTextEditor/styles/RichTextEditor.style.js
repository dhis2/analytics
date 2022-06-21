import { colors, spacers, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const mainClasses = css`
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
    }

    .preview {
        font-size: 14px;
        line-height: 19px;
        color: ${colors.grey900};
    }

    .textarea {
        width: 100%;
        box-sizing: border-box;
        padding: ${spacers.dp8} ${spacers.dp12};

        color: ${colors.grey900};
        background-color: ${colors.white};

        border: 1px solid ${colors.grey500};
        border-radius: 3px;
        box-shadow: inset 0 0 0 1px rgba(102, 113, 123, 0.15),
            inset 0 1px 2px 0 rgba(102, 113, 123, 0.1);
        outline: 0;

        font-size: 14px;
        line-height: ${spacers.dp16};
        user-select: text;
    }

    .textarea:focus {
        outline: none;
        box-shadow: 0 0 0 3px ${theme.focus};
    }

    .textarea:disabled {
        background-color: ${colors.grey100};
        border-color: ${colors.grey500};
        color: ${theme.disabled};
        cursor: not-allowed;
    }
`

export const toolbarClasses = css`
    .toolbar {
        background: ${colors.grey050};
        border-radius: 3px;
        border: 1px solid ${colors.grey300};
        margin-bottom: ${spacers.dp4};
    }

    .actionsWrapper {
        display: flex;
        gap: ${spacers.dp4};
        align-items: center;
        padding: ${spacers.dp4};
    }

    .mainActions {
        display: flex;
        gap: ${spacers.dp4};
        margin-top: ${spacers.dp2};
    }

    .sideActions {
        flex-shrink: 0;
        margin-left: auto;
    }

    .previewWrapper {
        margin: ${spacers.dp4};
        text-align: right;
    }
`

export const tooltipAnchorClasses = css`
    .tooltip {
        display: inline-flex;
        align-items: center;
    }
`

export const emojisPopoverClasses = css`
    .emojisList {
        display: flex;
        gap: ${spacers.dp8};
        list-style-type: none;
        margin: 0 ${spacers.dp4} 0 ${spacers.dp8};
        padding: 0;
    }

    .emojisList li {
        cursor: pointer;
    }
`
