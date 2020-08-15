export interface INewCtdnList {
    [chatId: string]: {
        queue: EQueue,
        data: ICtdn
    }
}

export interface ICtdnList {
    [chatId: string]: ICtdn[]
}

export interface ICtdn {
    chatId: number,
    title: string,
    year: number,
    month: number,
    day: number,
    created: number | string,
    time?: string
};

export enum EQueue {
    NOT_STARTED = 'not_started',
    START = 'start',
    TITLE = 'title',
    YEAR = 'year',
    MONTH = 'month',
    DAY = 'day',
    TIME = 'time',
    END = 'end'
}
