const isCreatorOrSuperuser = (object, currentUser) =>
    object?.createdBy.id === currentUser?.id ||
    currentUser?.authorities.has('ALL')

export const getInterpretationAccess = (interpretation, currentUser) => {
    const canEditDelete = isCreatorOrSuperuser(interpretation, currentUser)
    return {
        share: interpretation.access.manage,
        reply: interpretation.access.write,
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
