import css from 'styled-jsx/css'

export default css`
    .nav-button {
        padding: 5px 13px 3px;
        border: 1px solid #eceff1;
        text-transform: none;
        border-radius: 0;
        margin-right: -1px;
        font-size: 0.875rem;
        font-weight: 500;
        line-height: 1.75;
        font-family: Roboto, sans-serif;
    }

    .nav-button:first-child {
        border-radius: 2px 0 0 2px;
    }

    .nav-button:last-child {
        border-radius: 0 2px 2px 0;
    }

    .nav-button:hover {
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.08);
    }

    .nav-button:focus {
        outline: none;
    }

    .nav-button.active,
    .nav-button.active:hover {
        background-color: #00796b;
        color: #fff;
    }
`
