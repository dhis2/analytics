import { intersect } from 'mathjs'

export const getIntersectionPoint = (...endPoints) => intersect(...endPoints)
