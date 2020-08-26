import { NEW_COUNTDOWN_CREATION_PROCESS, NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, COUNTDOWN_LIST } from "./action-types";
import {EQueue, ICtdn, IOwnerIDType, ICtdnItem} from "../intrafaces/countdown";
import {countdownApi} from "../firebase/countdown";
import {scheduler} from "../scheduler/scheduler";

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
        const countdown = newCountdownStartedList[ownerId].data;
        return countdownApi.postCountdown(ownerId, countdown)
            .then(result => {
                const name = result?.data?.name;
                dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, payload: {id: ownerId, name}});
                scheduler.newEvent(ownerId, name, countdown);
            });
    }
}

export function updateCountdownList(ownerId: IOwnerIDType, data: ICtdnItem) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: COUNTDOWN_LIST, payload: {id: ownerId, data}});
    }
}
