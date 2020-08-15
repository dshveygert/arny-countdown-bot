import { NEW_COUNTDOWN_CREATION_PROCESS, NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED } from "./action-types";
import {EQueue, ICtdn} from "../intrafaces/countdown";

interface NewCtdnCreation {
    type: typeof NEW_COUNTDOWN_CREATION_PROCESS
    payload: {id: string, queue: EQueue, data?: Partial<ICtdn>}
}

interface NewCtdnCreationCompleted {
    type: typeof NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED
    payload: string
}

export type NewCtdnTypes = NewCtdnCreation | NewCtdnCreationCompleted

export function newCountdown(ownerId: string, queue: EQueue, data?: Partial<ICtdn>): NewCtdnCreation {
    return {type: NEW_COUNTDOWN_CREATION_PROCESS, payload: {id: ownerId, queue, data}};
}

export function newCountdownCreated(ownerId: string): NewCtdnCreationCompleted {
    return {type: NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED, payload: ownerId};
}


