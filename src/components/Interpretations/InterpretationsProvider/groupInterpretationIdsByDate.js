export const groupInterpretationIdsByDate = (interpretations) =>
    interpretations
        .sort((a, b) => new Date(b.created) - new Date(a.created))
        .reduce((dateGroups, interpretation) => {
            const dateKey = interpretation.created.split('T')[0]

            if (dateKey in dateGroups) {
                dateGroups[dateKey].push(interpretation.id)
            } else {
                dateGroups[dateKey] = [interpretation.id]
            }

            return dateGroups
        }, {})
