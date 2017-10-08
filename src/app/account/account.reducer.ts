export interface State {
    name: string;
}

const initialState: State = {
    name: 'default',
};

export function reducer(state = initialState, action): State {
    switch (action.type) {
        case 'ACCOUNT_ADD':
            return {
                name: 'accoutn 1',
            };

        case 'ACCOUNT_DELETE':
            return {
                name: 'default',
            };

        default:
            return state;
    }
}
  