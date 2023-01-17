import css from 'styled-jsx/css'

export default css`
    .scrollContainer {
        width: 350px;
        height: 300px;
        overflow: hidden;
        overflow-y: auto;
    }

    .contentContainer {
        position: relative;
        min-height: 1px;
    }

    .container {
        boxSizing: border-box;
        border: 1px solid #f76a8c;
        background: rgba(246,172,200,0.4);
        width: 100%;
        height: 100px;
        position: absolute;
        bottom: 0;
        left: 0;
    },
`
