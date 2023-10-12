// For backwards compatibility
// accept both Set (from the old d2.currentUser object) and array
const hasAuthority = (authorities, authority) => {
    if (!authority || typeof authority !== 'string) {
        throw new Error(`"hasAuthority" requires "authority" to be a populated string but received ${authority}`)
    } else if (Array.isArray(authorities)) {
        return authorities.includes(authority)
    } else if (typeof authorities.has === 'function') {
        return authorities.has(authority)
    } else {
        throw new Error(`"hasAuthority" requires "authorities" to be an array or set of authorities (strings)`)
    }
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
