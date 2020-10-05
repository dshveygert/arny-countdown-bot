import {
    NEW_COUNTDOWN_CREATION_PROCESS,
    NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED,
    COUNTDOWN_LIST,
    AUTHORISATION, AUTHORISATION_COMPLETE
} from "./action-types";
import {EQueue, ICtdn, IOwnerIDType, ICtdnItem} from "../interfaces/countdown";
import {countdownApi} from "../firebase/countdownApi";
import {scheduler} from "../scheduler/scheduler";
import {IAuth} from "../interfaces/firebase";
import { authApi } from "../firebase/authApi";

interface NewCtdnCreation {
    type: typeof NEW_COUNTDOWN_CREATION_PROCESS
    payload: {id: IOwnerIDType, queue: EQueue, data?: Partial<ICtdn>}
}

interface NewCtdnCreationCompleted {
    type: typeof NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED
    payload: {id: IOwnerIDType, name: string}
}

interface CtdnList {
    type: typeof COUNTDOWN_LIST
    payload: {id: IOwnerIDType, data: ICtdnItem}
}

interface Authorisation {
    type: typeof AUTHORISATION
    payload: string
}

interface AuthToken {
    type: typeof AUTHORISATION_COMPLETE
    payload: IAuth
}

export type NewCtdnTypes = NewCtdnCreation | NewCtdnCreationCompleted | CtdnList;
export type AuthorisationTypes = Authorisation | AuthToken;

export function newCountdown(ownerId: IOwnerIDType, queue: EQueue, data?: Partial<ICtdn>) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS, payload: {id: ownerId, queue, data}});
    }
}

export function newCountdownCreated(ownerId: string, data: ICtdn) {
    // @ts-ignore
    return (dispatch, getState) => {
        return countdownApi.postCountdown(ownerId, data)
            .then(result => {
                const name = result?.data?.name;
                dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, payload: {id: ownerId, name}});
                scheduler.newEvent(ownerId, name, data);
            });
    }
}

export function updateCountdownList(ownerId: IOwnerIDType, data: ICtdnItem) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: COUNTDOWN_LIST, payload: {id: ownerId, data}});
    }
}

export function auth(data: string) {
    // @ts-ignore
    return (dispatch, getState) => {
        dispatch({type: AUTHORISATION, payload: data});
        return authApi.auth(data)
            .then(result => {
                dispatch({type: AUTHORISATION_COMPLETE, payload: {...result?.data, updated_at: Date.now()}});
            });
    }
}

export function updateAuthData(data: IAuth) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: AUTHORISATION_COMPLETE, payload: {...data, updated_at: Date.now()}});
    }
}

