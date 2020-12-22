export const sortByX = (data, { mutate = false }) => {
    const d = mutate ? d : d.slice()
    
    return d.sort((a, b) => a[0] > b[0] ? 1 : a[0] < b[0] ? -1 : 0)
}