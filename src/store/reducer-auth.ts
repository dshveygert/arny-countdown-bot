import {AUTHORISATION, AUTHORISATION_COMPLETE} from "./action-types";
import {AuthorisationTypes} from "./actions";
import {IAuth} from "../interfaces/firebase";

const initialState = {
    auth: {} as IAuth
};

function authReducer(state = initialState, action: AuthorisationTypes) {
    switch (action.type) {
        case AUTHORISATION:
            return {...state, user_data: action.payload};

        case AUTHORISATION_COMPLETE:
            return {...state, auth: action.payload};

        default:
            return state;
    }
}

export {
    authReducer
}
