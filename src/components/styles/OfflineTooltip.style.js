import css from 'styled-jsx/css'

export const styles = css`
    .tooltip {
        display: inline-flex;
        pointer-events: all;
    }
    .tooltip > :global(button:disabled) {
        pointer-events: none;
    }

    .notAllowed {
        cursor: not-allowed;
    }
`
