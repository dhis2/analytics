import {
    getInterpretationAccess,
    getCommentAccess,
} from '../getInterpretationAccess.js'

const superuser = {
    id: 'iamsuper',
    authorities: new Set(['ALL']),
}

const userJoe = {
    id: 'johndoe',
    authorities: new Set(['Some']),
}

const userJane = {
    id: 'jane',
    authorities: new Set(['Some']),
}

describe('interpretation and comment access', () => {
    describe('getInterpretationAccess', () => {
        it('returns true for all accesses for superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: {
                    id: 'boateng',
                },
            }

            expect(
                getInterpretationAccess(interpretation, superuser)
            ).toMatchObject({
                share: true,
                reply: true,
                edit: true,
                delete: true,
            })
        })
        it('returns true for all accesses for creator', () => {
            const currentUser = userJoe

            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJoe,
            }

            expect(
                getInterpretationAccess(interpretation, currentUser)
            ).toMatchObject({
                share: true,
                reply: true,
                edit: true,
                delete: true,
            })
        })

        it('returns false for edit/delete if user is not creator/superuser', () => {
            const currentUser = userJoe

            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJane,
            }

            expect(
                getInterpretationAccess(interpretation, currentUser)
            ).toMatchObject({
                share: true,
                reply: true,
                edit: false,
                delete: false,
            })
        })

        it('returns false for reply/edit/delete if user is not creator/superuser and no write access', () => {
            const currentUser = userJoe

            const interpretation = {
                access: {
                    write: false,
                    manage: true,
                },
                createdBy: userJane,
            }

            expect(
                getInterpretationAccess(interpretation, currentUser)
            ).toMatchObject({
                share: true,
                reply: false,
                edit: false,
                delete: false,
            })
        })

        it('returns false for share/reply/edit/delete if user is not creator/superuser and no write or manage access', () => {
            const currentUser = userJoe

            const interpretation = {
                access: {
                    write: false,
                    manage: false,
                },
                createdBy: userJane,
            }

            expect(
                getInterpretationAccess(interpretation, currentUser)
            ).toMatchObject({
                share: false,
                reply: false,
                edit: false,
                delete: false,
            })
        })
    })

    describe('getCommentAccess', () => {
        it('returns true for all accesses for superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                },
            }

            const comment = {
                createdBy: {
                    id: userJoe,
                },
            }

            expect(
                getCommentAccess(
                    comment,
                    interpretation.access.write,
                    superuser
                )
            ).toMatchObject({
                edit: true,
                delete: true,
            })
        })

        it('returns true for all accesses for creator when interpretation has write access', () => {
            const interpretation = {
                access: {
                    write: true,
                },
            }

            const comment = {
                createdBy: userJoe,
            }

            expect(
                getCommentAccess(comment, interpretation.access.write, userJoe)
            ).toMatchObject({
                edit: true,
                delete: true,
            })
        })

        it('returns true for edit and false for delete for creator when interpretation does not have write access', () => {
            const interpretation = {
                access: {
                    write: false,
                },
            }

            const comment = {
                createdBy: userJoe,
            }

            expect(
                getCommentAccess(comment, interpretation.access.write, userJoe)
            ).toMatchObject({
                edit: true,
                delete: false,
            })
        })

        it('returns false for edit/delete for user who is not creator or superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                },
            }

            const comment = {
                createdBy: userJane,
            }

            expect(
                getCommentAccess(comment, interpretation.access.write, userJoe)
            ).toMatchObject({
                edit: false,
                delete: false,
            })
        })
    })
})
