// For backwards compatibility
// accept both Set (from the old d2.currentUser object) and array
const hasAuthority = (authorities = [], authority) => {
    if (Array.isArray(authorities)) {
        return authorities.includes(authority)
    }
    return typeof authorities.has === 'function'
        ? authorities.has(authority)
        : false
}

const isSuperuser = (authorities) => hasAuthority(authorities, 'ALL')

const isCreator = (object, currentUser) =>
    object?.createdBy.id === currentUser?.id

export const getInterpretationAccess = (interpretation, currentUser) => {
    const canEditDelete =
        isCreator(interpretation, currentUser) ||
        isSuperuser(currentUser?.authorities)
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
    const canEditDelete =
        isCreator(comment, currentUser) || isSuperuser(currentUser?.authorities)
    return {
        edit: canEditDelete,
        delete: canEditDelete && hasInterpretationReplyAccess,
    }
}
