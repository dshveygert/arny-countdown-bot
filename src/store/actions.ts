import { NEW_COUNTDOWN_CREATION_PROCESS, NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, COUNTDOWN_LIST } from "./action-types";
import {EQueue, ICtdn, IOwnerIDType, ICtdnItem} from "../intrafaces/countdown";
import {countdownApi} from "../firebase/countdown";

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

export type NewCtdnTypes = NewCtdnCreation | NewCtdnCreationCompleted | CtdnList;

export function newCountdown(ownerId: IOwnerIDType, queue: EQueue, data?: Partial<ICtdn>) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS, payload: {id: ownerId, queue, data}});
    }
}

export function newCountdownCreated(ownerId: string) {
    // @ts-ignore
    return (dispatch, getState) => {
        const { newCountdownStartedList } = getState();
        return countdownApi.postCountdown(ownerId, newCountdownStartedList[ownerId].data).then(result => {
            dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, payload: {id: ownerId, name: result?.data?.name}});
        });
    }
}

export function updateCountdownList(ownerId: IOwnerIDType, data: ICtdnItem) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: COUNTDOWN_LIST, payload: {id: ownerId, data}});
    }
}
