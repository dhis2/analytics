import css from 'styled-jsx/css'

export default css`
    .disabled {
        cursor: not-allowed;
    }
    .disabled > :global(*) {
        pointer-events: none;
    }
`
