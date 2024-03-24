# Filter Component

The Filter component is a reusable input field component from the DHIS2 UI library. It is used to filter data based on the user's input.

## Props

- `text`: The current value of the input field. It is a string.
- `onChange`: A function that is called when the value of the input field changes. It is required.
- `onClear`: A function that is called when the input field is cleared. It is required.
- `placeholder`: The placeholder text for the input field. It is a required string.
- `type`: The type of the input field. It defaults to 'text'.
- `dataTest`: A string used for testing purposes.

## Usage
Here is an example of how to use the Filter component:

```jsx
import { Filter } from '@dhis2/analytics'

<Filter
    text="Search text"
    onChange={(value) => console.log(`New value: ${value}`)}
    onClear={() => console.log('Input cleared')}
    placeholder="Search..."
    type="text"
    dataTest="dhis2-uicore-filter"
/>
```

In this example, the `Filter` component is imported from the `@dhis2/analytics` package. The `text` prop is set to "Search text", the `onChange` prop is set to a function that returns 'True' if the value is truthy and 'False' otherwise, the `onClear` prop is set to a function that logs a message when the input is cleared, the `placeholder` prop is set to "Search...", the `type` prop is set to "text", and the `dataTest` prop is set to "dhis2-uicore-filter".

