import css from 'styled-jsx/css'
import { spacers } from '@dhis2/ui'

export default css`
    .leftSection {
        flex-grow: 1;
    }
    .leftSection > :global(.filterElement),
    .rightSection > :global(.filterElement) {
        margin: 0;
    }
    .rightSection {
        width: 120px;
        margin-left: ${spacers.dp8};
    }
`
