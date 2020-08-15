import { NEW_COUNTDOWN_CREATION_PROCESS, NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED } from "./action-types";
import {EQueue, ICtdnList, INewCtdnList} from "../intrafaces/countdown";
import {NewCtdnTypes} from "./actions";

const queue = [EQueue.START, EQueue.TITLE, EQueue.YEAR, EQueue.MONTH, EQueue.DAY, EQueue.TIME, EQueue.END];
const initialState = {
    newCountdownStartedList: {} as INewCtdnList,
    countdownList: {} as ICtdnList
};

function countdown(state = initialState, action: NewCtdnTypes) {
    switch (action.type) {
        case NEW_COUNTDOWN_CREATION_PROCESS:
            const update = {
                ...state.newCountdownStartedList,
                [action.payload.id]: {
                    queue: action.payload.queue,
                    data: {
                        ...state.newCountdownStartedList[action.payload.id]?.data,
                        ...action.payload.data,
                    }

                }
            }
            return {...state, newCountdownStartedList: update};

        case NEW_COUNTDOWN_CREATION_PROCESS_COMPLETED:
            const updateNew = {
                ...state.newCountdownStartedList,
                [action.payload]: {
                    queue: EQueue.NOT_STARTED,
                    data: {}
                }
            };
            const updateList = state.countdownList[action.payload] ? {
                ...state.countdownList,
                [action.payload]: [
                    ...state.countdownList[action.payload],
                    state.newCountdownStartedList[action.payload].data
                ]
            } : {
                ...state.countdownList,
                [action.payload]: [state.newCountdownStartedList[action.payload].data]
            }
            return {...state, newCountdownStartedList: updateNew, countdownList: updateList};

        default:
            return state;
    }
}

export {
    countdown,
    queue
}
