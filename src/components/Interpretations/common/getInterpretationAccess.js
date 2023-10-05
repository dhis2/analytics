import { isArray } from 'lodash'

// For backwards compatibility
// accept both Set (from the old d2.currentUser object) and array
const isSuperuser = (authorities = []) => {
    if (isArray(authorities)) {
        return authorities.includes('ALL')
    }
    return authorities.has('ALL')
}

const isCreatorOrSuperuser = (object, currentUser) =>
    object?.createdBy.id === currentUser?.id ||
    isSuperuser(currentUser?.authorities)

export const getInterpretationAccess = (interpretation, currentUser) => {
    const canEditDelete = isCreatorOrSuperuser(interpretation, currentUser)
    return {
        share: interpretation.access.manage,
        comment: interpretation.access.write,
        edit: canEditDelete,
        delete: canEditDelete,
    }
}

export const getCommentAccess = (
    comment,
    hasInterpretationReplyAccess,
    currentUser
) => {
    const canEditDelete = isCreatorOrSuperuser(comment, currentUser)
    return {
        edit: canEditDelete,
        delete: canEditDelete && hasInterpretationReplyAccess,
    }
}
