# OrgUnitDimension Component

The OrgUnitDimension component is a part of the DHIS2 analytics package. It is used to select organisation units, levels, and groups.

## Props

- `roots`: An array of strings representing the roots of the organisation units.
- `selected`: An array of objects representing the selected organisation units. Each object should have an `id` and `name` property, and may optionally have a `path` property.
- `onSelect`: A function that is called when an organisation unit is selected.
- `hideGroupSelect`: A boolean that determines whether the group select should be hidden. Defaults to `false`.
- `hideLevelSelect`: A boolean that determines whether the level select should be hidden. Defaults to `false`.
- `hideUserOrgUnits`: A boolean that determines whether the user organisation units should be hidden. Defaults to `false`.
- `warning`: A string that represents a warning message.

## Usage
```javascript
import { OrgUnitDimension } from '@dhis2/analytics'

<OrgUnitDimension
    roots={['A0000001234']}
    selected={[{ id: 'B0000001234', name: 'Unit B' }]}
    onSelect={(selected) => console.log('Selected:', selected)}
    hideGroupSelect={false}
    hideLevelSelect={false}
    hideUserOrgUnits={false}
    warning="This is a warning message"
/>
```

