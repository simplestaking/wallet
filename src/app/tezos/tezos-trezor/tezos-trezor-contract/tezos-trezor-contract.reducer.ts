const initialState: any = {
    ids: [],
    entities: {},
    selected: '',
    page: 0,
    itemsPerPage: 10,
    itemsTotalCount: 0,
    pending: false,
    error: false,
    errorTyle: '',
}

export function reducer(state = initialState, action) {
    switch (action.type) {

        default:
            return state;
    }
}