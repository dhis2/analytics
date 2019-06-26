export default function(store, layout, extraOptions) {
    let categories

    if (extraOptions.xAxisLabels) {
        categories = extraOptions.xAxisLabels
    } else {
        // look for the response with the longer list of periods.
        // in some cases (ie. weeks per year) responses might have a different number of periods in metadata
        const res = store.data.reduce((out, r) => {
            if (out) {
                if (
                    r.metaData.dimensions.pe.length >
                    out.metaData.dimensions.pe.length
                ) {
                    out = r
                }
            } else {
                out = r
            }

            return out
        }, {})

        const metaData = res.metaData

        categories = metaData.dimensions.pe.reduce((categories, periodId) => {
            // TODO use shortName or pass extra option to the request for getting short names in name prop
            categories.push(metaData.items[periodId].name)
            return categories
        }, [])
    }

    return {
        categories,
    }
}
