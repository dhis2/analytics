import { colors, spacers, theme } from '@dhis2/ui'
import css from 'styled-jsx/css'

export const mainClasses = css`
    .container {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }

    .preview {
        padding: 0 ${spacers.dp8} ${spacers.dp8} ${spacers.dp8};
        font-size: 14px;
        line-height: ${spacers.dp16};
        color: ${colors.grey900};
        border: 1px solid ${colors.grey500};
        border-block-start: none;
        border-radius: 0 0 3px 3px;
        overflow-y: auto;
        scroll-behavior: smooth;
    }

    .preview :global(p:first-of-type) {
        margin: 0;
    }

    .edit {
        width: 100%;
        height: 100%;
        scroll-behavior: smooth;
    }

    .textarea {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: ${spacers.dp4} ${spacers.dp8} ${spacers.dp8} ${spacers.dp8};

        color: ${colors.grey900};
        background-color: ${colors.white};

        border: 1px solid ${colors.grey500};
        border-block-start: none;
        border-radius: 0 0 3px 3px;

        box-shadow: inset 0 0 1px 0 rgba(48, 54, 60, 0.1);
        outline: 0;

        font-size: 14px;
        line-height: 21px;
        user-select: text;
        resize: none;
    }

    .textarea.resizable {
        resize: vertical;
    }

    .textarea::placeholder {
        color: ${colors.grey600};
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
        background: ${colors.white};
        border-radius: 3px 3px 0 0;
        border: 1px solid ${colors.grey500};
        border-bottom-color: transparent;
    }

    .actionsWrapper {
        display: flex;
        flex-wrap: wrap;
        gap: ${spacers.dp4};
        align-items: center;
        justify-content: space-between;
        padding: ${spacers.dp4} ${spacers.dp4} 0 ${spacers.dp4};
    }

    .mainActions {
        display: flex;
        gap: 0;
        margin-top: 0;
    }

    .sideActions {
        flex-shrink: 0;
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

export const toolbarButtonClasses = css`
    .toolbarButton {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: ${spacers.dp4} 6px;
        background: none;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        color: ${colors.grey700};
        font-size: 13px;
        font-family: inherit;
        line-height: 1.4;
    }

    .toolbarButton:hover:not(:disabled) {
        background-color: ${colors.grey200};
    }

    .toolbarButton:active:not(:disabled) {
        background-color: ${colors.grey300};
    }

    .toolbarButton:disabled {
        cursor: not-allowed;
        color: ${colors.grey500};
    }

    .toolbarButton:focus-visible {
        outline: 2px solid ${theme.focus};
        outline-offset: -2px;
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
