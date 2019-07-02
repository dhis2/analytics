// Rules to be used for:

// - layout: is it valid?
// - dnd: can this dimension be dropped here?
// - chip label: too many items selected?
// - context menus: show "move to category" option?

// Before applying any rules we assume that:

// - axis allows any dimension
// - axis allows any number of dimensions
// - dimension allows any number of items

// Props:

// - requiredAxes
// - allowedAxes
// - maxNumberOfDimensions
// - maxNumberOfItems

// Rules

const DEFAULT_PIVOT_TABLE = {
    requiredAxes: ['columns|rows'],
}

const DEFAULT_CHART = {
    requiredAxes: ['columns', 'rows'],
    maxNumberOfDimensions: {
        columns: 1,
        rows: 1,
    },
}

const PIE = {
    requiredAxes: ['columns'],
    maxNumberOfDimensions: {
        columns: 1,
    },
}

const DEFAULT_SINGLE_VALUE = {
    required: ['columns'],
    maxNumberOfDimensions: {
        columns: 1,
    },
    maxNumberOfItems: {
        columns: 1,
    },
    allowedAxes: {
        pe: ['filters'],
        ou: ['filters'],
    },
}

// Map

const getRules = type => {
    switch (type) {
        case REPORT_TABLE:
            return DEFAULT_PIVOT_TABLE
        case PIE:
            return PIE
        case GAUGE:
        case SINGLE_VALUE:
            return DEFAULT_SINGLE_VALUE
        case COLUMN:
        case STACKED_COLUMN:
        case BAR:
        case STACKED_BAR:
        case LINE:
        case AREA:
        case RADAR:
        case YEAR_OVER_YEAR_LINE:
        case YEAR_OVER_YEAR_COLUMN:
        default:
            return DEFAULT_CHART
    }
}

// HELPER FNS
