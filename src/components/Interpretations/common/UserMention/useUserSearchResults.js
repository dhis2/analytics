import { useDataQuery } from '@dhis2/app-runtime'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'

const usersQuery = {
    users: {
        resource: 'users/gist',
        params: ({ searchText }) => ({
            fields: 'id,displayName,username',
            order: 'firstName,surname',
            total: true,
            filter: `username:ilike:${searchText},firstName:ilike:${searchText},surname:ilike:${searchText},email:ilike:${searchText}`,
            rootJunction: 'OR',
        }),
    },
}

export const useUserSearchResults = ({ searchText }) => {
    const [{ users, pager }, setData] = useState({ users: [], pager: {} })
    const { data, fetching, refetch } = useDataQuery(usersQuery, {
        lazy: true,
    })

    const debouncedRefetch = useCallback(debounce(refetch, 250), [refetch])

    useEffect(() => {
        if (searchText.length) {
            debouncedRefetch({ searchText })
        }

        return () => debouncedRefetch.cancel()
    }, [searchText])

    useEffect(() => {
        if (data) {
            setData(data.users)
        }
    }, [data])

    return {
        users,
        pager,
        fetching,
        clear: () => setData({ users: [], pager: {} }),
    }
}
