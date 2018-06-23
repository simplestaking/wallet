const initialState = {
    node: {
        isConnected: false,
        isUpdated: false,
        timestamp: 0,
    },
    user: {
        uid: null,
        email: null, 
        displayName: null,
    },
    progressbar: {
        isVisible: false,
        counter: 0,
    },
    // menu in sidebar/sideNav
    sidenav: {
        isVisible: false,
        toggleButton: {
            isVisible: false,
        },
    },
    logo: {
        isVisible: true,
    }

};

export function reducer(state = initialState, action) {
    switch (action.type) {
        case 'HEARTBEAT':
            return {
                ...state,
                node: {
                    isConnected: false,
                    isUpdated: false,
                    timestamp: 0,
                }
            }

        case 'HEARTBEAT_SUCCESS':
            return {
                ...state,
                node: {
                    isConnected: true,
                    isUpdated: true, // use moment to find difference
                    timestamp: action.payload.timestamp,
                }
            }

        case 'HEARTBEAT_ERROR':
            return {
                ...state,
                node: {
                    isConnected: false,
                    isUpdated: false,
                }
            }

        case 'AUTH_LOGIN_SUCCESS': {
            return {
                ...state,
                user: {
                    uid: action.payload.uid,
                    email: action.payload.email,
                    displayName: action.payload.displayName,
                }
            }
        }
        
        case 'AUTH_LOGOUT_SUCCESS': {
            return {
                ...state,
                user: initialState.user
            }
        }
        
        case 'PROGRESSBAR_SHOW': {
            return {
                ...state,
                progressbar: {
                    isVisible: state.progressbar.counter >= 0 ? true : false ,
                    counter: state.progressbar.counter + 1
                }
            }
        }    
        
        case 'PROGRESSBAR_HIDE': {
            return {
                ...state,
                progressbar: {
                    counter: state.progressbar.counter - 1,
                    isVisible: state.progressbar.counter === 1 ? false : true,
                }
            }
        }
      
        default:
            return state;
    }
}