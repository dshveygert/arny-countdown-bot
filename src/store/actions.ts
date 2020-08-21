import { NEW_COUNTDOWN_CREATION_PROCESS, NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED } from "./action-types";
import {EQueue, ICtdn} from "../intrafaces/countdown";
import {countdownApi} from "../firebase/countdown";

interface NewCtdnCreation {
    type: typeof NEW_COUNTDOWN_CREATION_PROCESS
    payload: {id: string, queue: EQueue, data?: Partial<ICtdn>}
}

interface NewCtdnCreationCompleted {
    type: typeof NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED
    payload: {id: string, name: string}
}

export type NewCtdnTypes = NewCtdnCreation | NewCtdnCreationCompleted

export function newCountdown(ownerId: string, queue: EQueue, data?: Partial<ICtdn>) {
    // @ts-ignore
    return (dispatch) => {
        dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS, payload: {id: ownerId, queue, data}});
    }
}

export function newCountdownCreated(ownerId: string) {
    // @ts-ignore
    return (dispatch, getState) => {
        console.log('[getState]', getState());
        const { newCountdownStartedList } = getState();
        return countdownApi.postCountdown(ownerId, newCountdownStartedList[ownerId].data).then(result => {
            dispatch({type: NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, payload: {id: ownerId, name: result?.data?.name}});
        });
    }
}


