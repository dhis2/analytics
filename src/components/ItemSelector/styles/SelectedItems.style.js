import { colors } from '../../../modules/colors'
import css from 'styled-jsx/css'

export default css`
    .selected-list {
        flex: 1;
        list-style: none;
        margin: 0 6px;
        overflow-y: auto;
        padding-left: 0px;
        user-select: none;
    }

    .selected-list-item {
        display: flex;
        margin: 2px;
    }

    .selected-list-item:focus {
        outline: none;
    }

    .subtitle-container {
        border-bottom: 1px solid ${colors.greyLight};
        height: 42px;
    }

    .subtitle-text {
        color: ${colors.black};
        height: 20px;
        font-family: Roboto;
        font-size: 15px;
        font-weight: 500;
        left: 8px;
        position: relative;
        top: 12px;
    }

    .info-container {
        display: flex;
        margin: 8px;
        padding: 8px;
        background-color: #e8edf2;
        border-radius: 4px;
    }

    .info-text {
        padding-left: 6px;
        color: #4a5768;
        font-size: 12px;
        line-height: 17px;
    }

    .info-icon {
        font-size: 16px;
        color: #4a5768;
    }

    .deselect-all-button {
        display: block;
        margin: 0 auto;
        padding: 5px;
    }

    .deselect-highlighted-button {
        left: -48px;
        position: absolute;
        top: 291px;
    }
`
