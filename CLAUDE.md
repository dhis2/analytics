# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

-   `yarn start` - Start Storybook development server on port 5000
-   `yarn start-storybook` - Alternative command to start Storybook
-   `yarn build` - Build the library using d2-app-scripts
-   `yarn build-storybook` - Build Storybook for production

### Testing

-   `yarn test` - Run tests using d2-app-scripts test
-   Jest configuration is in `jest.config.js` with setup in `config/setupTestingLibrary.js`

### Code Quality

-   `yarn lint` - Run d2-style linting checks
-   `yarn format` - Apply d2-style formatting
-   `yarn validate-commit` - Check staged files (used in git hooks)
-   `yarn validate-push` - Run tests before push

## Architecture Overview

This is the DHIS2 Analytics library that provides shared components and utilities for DHIS2 analytics applications (dashboards, data visualizer, maps, line listing).

### Core Structure

**Components** (`src/components/`)

-   **DataDimension** - Data element/indicator selection
-   **PeriodDimension** - Period selection with relative and fixed periods
-   **OrgUnitDimension** - Organisation unit selection
-   **DynamicDimension** - Generic dimension component for categories, etc.
-   **DimensionsPanel** - Layout manager for drag/drop dimension arrangement
-   **PivotTable** - Pivot table visualization component
-   **FileMenu** - Save/load functionality
-   **Interpretations** - Comments and interpretation system
-   **Toolbar** - Common toolbar components
-   **Options/VisualizationOptions** - Configuration dialogs

**Modules** (`src/modules/`)

-   **layout/** - Core layout system managing dimensions across columns/rows/filters
-   **predefinedDimensions.js** - Data (dx), Period (pe), OrgUnit (ou) dimension utilities
-   **visTypes.js** - Visualization type constants and utilities
-   **layoutUiRules/** - Business logic for dimension placement rules
-   **axis.js** - Axis manipulation utilities
-   **fontStyle.js** - Typography configuration
-   **valueTypes.js** - DHIS2 value type definitions

**Visualizations** (`src/visualizations/`)

-   Chart creation and rendering utilities
-   Color sets and theming

### Layout System

The library centers around a **layout** object with three axes:

```javascript
{
  columns: [dimensions],  // Top/horizontal in tables, series in charts
  rows: [dimensions],     // Left/vertical in tables, category in charts
  filters: [dimensions]   // Applied as filters to data
}
```

Each **dimension** has:

```javascript
{
  dimension: "dx",        // Dimension ID (dx=data, pe=period, ou=orgunit)
  items: [{id: "..."}]    // Selected items
}
```

### Key Exports

The library exports components, API utilities, and layout manipulation functions. Main categories:

-   **Components**: DataDimension, PeriodDimension, OrgUnitDimension, DimensionsPanel, PivotTable, FileMenu
-   **Layout utilities**: Layout manipulation, axis utilities, dimension management
-   **API utilities**: Analytics API wrapper, dimension fetching
-   **Constants**: Visualization types, layout types, axis IDs, dimension IDs

### Development Notes

-   Uses DHIS2 design system (`@dhis2/ui`) and app platform (`@dhis2/app-runtime`)
-   Built with React, exports as both ES and CommonJS modules
-   Styling with styled-jsx
-   Internationalization with `@dhis2/d2-i18n`
-   Uses d2-app-scripts for building/testing (DHIS2's CLI toolchain)
-   ESLint extends `@dhis2/cli-style` React configuration

### Testing Setup

-   Jest with React Testing Library
-   Setup file: `config/setupTestingLibrary.js`
-   Test files alongside source code
-   Excludes `/node_modules/` and `/build/` from test paths
