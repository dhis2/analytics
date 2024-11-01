import {
    getInterpretationAccess,
    getCommentAccess,
} from '../getInterpretationAccess.js'

const superuserD2CurrentUser = {
    id: 'iamsuper',
    authorities: new Set(['ALL']),
}

const userJoeD2CurrentUser = {
    id: 'johndoe',
    authorities: new Set(['Some']),
}

const userJaneD2CurrentUser = {
    id: 'jane',
    authorities: new Set(['Some']),
}

const superuser = {
    id: 'iamsuper',
    authorities: ['ALL'],
}

const userJoe = {
    id: 'johndoe',
    authorities: ['Some'],
}

const userJane = {
    id: 'jane',
    authorities: ['Some'],
}

describe('interpretation and comment access', () => {
    describe('getInterpretationAccess', () => {
        it('returns true for all accesses for superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJoe,
            }

            expect(
                getInterpretationAccess(interpretation, superuser)
            ).toMatchObject({
                share: true,
                comment: true,
                edit: true,
                delete: true,
            })
        })
        it('returns true for all accesses for creator', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJoe,
            }

            expect(
                getInterpretationAccess(interpretation, userJoe)
            ).toMatchObject({
                share: true,
                comment: true,
                edit: true,
                delete: true,
            })
        })

        it('returns false for edit/delete if user is not creator/superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJane,
            }

            expect(
                getInterpretationAccess(interpretation, userJoe)
            ).toMatchObject({
                share: true,
                comment: true,
                edit: false,
                delete: false,
            })
        })

        it('returns false for comment/edit/delete if user is not creator/superuser and no write access', () => {
            const interpretation = {
                access: {
                    write: false,
                    manage: true,
                },
                createdBy: userJane,
            }

            expect(
                getInterpretationAccess(interpretation, userJoe)
            ).toMatchObject({
                share: true,
                comment: false,
                edit: false,
                delete: false,
            })
        })

        it('returns false for share/comment/edit/delete if user is not creator/superuser and no write or manage access', () => {
            const interpretation = {
                access: {
                    write: false,
                    manage: false,
                },
                createdBy: userJane,
            }

            expect(
                getInterpretationAccess(interpretation, userJoe)
            ).toMatchObject({
                share: false,
                comment: false,
                edit: false,
                delete: false,
            })
        })

        it('throws an error for all accesses when no currentUser provided', () => {
            const interpretation = {
                access: {
                    write: false,
                    manage: false,
                },
                createdBy: userJane,
            }

            expect(() => getInterpretationAccess(interpretation)).toThrow(
                '"hasAuthority" requires "authorities" to be an array or set of authorities (strings)'
            )
        })

        it('throws an error when currentUser is missing authorities', () => {
            const interpretation = {
                access: {
                    write: false,
                    manage: false,
                },
                createdBy: userJane,
            }

            expect(() =>
                getInterpretationAccess(interpretation, {
                    id: 'usernoauthorties',
                })
            ).toThrow(
                '"hasAuthority" requires "authorities" to be an array or set of authorities (strings)'
            )
        })
    })

    describe('getInterpretationAccess using D2.currentUser', () => {
        it('returns true for all accesses for superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJoeD2CurrentUser,
            }

            expect(
                getInterpretationAccess(interpretation, superuserD2CurrentUser)
            ).toMatchObject({
                share: true,
                comment: true,
                edit: true,
                delete: true,
            })
        })
        it('returns true for all accesses for creator', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJoeD2CurrentUser,
            }

            expect(
                getInterpretationAccess(interpretation, userJoeD2CurrentUser)
            ).toMatchObject({
                share: true,
                comment: true,
                edit: true,
                delete: true,
            })
        })

        it('returns false for edit/delete if user is not creator/superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                    manage: true,
                },
                createdBy: userJaneD2CurrentUser,
            }

            expect(
                getInterpretationAccess(interpretation, userJoeD2CurrentUser)
            ).toMatchObject({
                share: true,
                comment: true,
                edit: false,
                delete: false,
            })
        })

        it('returns false for comment/edit/delete if user is not creator/superuser and no write access', () => {
            const interpretation = {
                access: {
                    write: false,
                    manage: true,
                },
                createdBy: userJaneD2CurrentUser,
            }

            expect(
                getInterpretationAccess(interpretation, userJoeD2CurrentUser)
            ).toMatchObject({
                share: true,
                comment: false,
                edit: false,
                delete: false,
            })
        })

        it('returns false for share/comment/edit/delete if user is not creator/superuser and no write or manage access', () => {
            const interpretation = {
                access: {
                    write: false,
                    manage: false,
                },
                createdBy: userJaneD2CurrentUser,
            }

            expect(
                getInterpretationAccess(interpretation, userJoeD2CurrentUser)
            ).toMatchObject({
                share: false,
                comment: false,
                edit: false,
                delete: false,
            })
        })
    })

    describe('getCommentAccess using D2.currentUser', () => {
        it('returns true for all accesses for superuser', () => {
            const interpretation = {
                access: {
                    write: true,
                },
            }

            const comment = {
                createdBy: userJoeD2CurrentUser,
            }

            expect(
                getCommentAccess(
                    comment,
                    interpretation.access.write,
                    superuserD2CurrentUser
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
                createdBy: userJoeD2CurrentUser,
            }

            expect(
                getCommentAccess(
                    comment,
                    interpretation.access.write,
                    userJoeD2CurrentUser
                )
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
                createdBy: userJoeD2CurrentUser,
            }

            expect(
                getCommentAccess(
                    comment,
                    interpretation.access.write,
                    userJoeD2CurrentUser
                )
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
                createdBy: userJaneD2CurrentUser,
            }

            expect(
                getCommentAccess(
                    comment,
                    interpretation.access.write,
                    userJoeD2CurrentUser
                )
            ).toMatchObject({
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
                createdBy: userJoe,
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
