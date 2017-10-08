const initialState = {
    node: {
        isConnected: false,
        isUpdated: false,
        timestamp: 0,
    }
};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'HEARTBEAT':
            return {
                node: {
                    isConnected: false,
                    isUpdated: false,
                    timestamp: 0,
                }
            }

        case 'HEARTBEAT_SUCCESS':
            return {
                node: {
                    isConnected: true,
                    isUpdated: true, // use moment to find difference
                    timestamp: action.payload.timestamp,
                }
            }

        case 'HEARTBEAT_ERROR':
            return {
                node: {
                    isConnected: false,
                    isUpdated: false,
                }
            }

        default:
            return state;
    }
}