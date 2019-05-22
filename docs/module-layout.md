# Layout description

### Layout

Layout refers to the dimensional part of a visualization in DHIS2. It has three axes:

```
{
    columns: [<dimensions>],
    rows: [<dimensions>],
    filters: [<dimensions>],
}
```

-   `columns`: Refers to top/horizontal dimensions in pivot tables and series dimensions in charts
-   `rows`: Refers to left/vertical dimensions in pivot tables and category dimensions in charts
-   `filters`: These dimensions simply filter the returned data values

### Axis

An axis is an array of dimensions.

### Dimension

A dimension is an object with a dimension id and an array of items.

```
{
    dimension: "dx",
    items: [<items>]
}
```

-   `dimension`: The id property of the dimension, note that it is not called "id"
-   `items`: Refers to the metadata you want to fetch data for, typically indicators/data elements, periods and organisation units

There are three fixed dimensions in DHIS2 (data, period and organisation unit), but you are free to add dynamic dimensions as well, e.g. data element group sets, organisation unit group sets, categories etc.

### Item

An item is an object with an id.

```
{
    id: "Uvn6LCg7dVU",
}
```

-   `id`: The id of the item

# Example layout

```
{
    columns: [{
        dimension: "dx",                                    // data dimension
        items: [{id: "Uvn6LCg7dVU"}, {id: "Uvn6LCg7dVU"}]   // two indicators
    }],
    rows: [{
        dimension: "pe",                                    // period dimension
        items: [{id: "THIS_YEAR"}]                          // a period
    }],
    filters: [{
        dimension: "ou",                                    // organisation unit dimension
        items: [{id: "LEVEL-2"}]                            // all orgunits at level 2
    }],
}
```
