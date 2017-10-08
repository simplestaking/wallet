export interface State {
    value: number;
}

const initialState: State = {
    value: 0,
};

export function reducer(state = initialState, action): State {
    switch (action.type) {
        case 'BALANCE_GET':
            return {
                value: 10,
            };

        default:
            return state;
    }
}