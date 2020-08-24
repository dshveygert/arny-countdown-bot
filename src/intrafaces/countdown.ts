export type IOwnerIDType = string;

export interface INewCtdnList {
    [ownerId: string]: {
        queue: EQueue,
        data: ICtdn
    }
}

export interface ICtdnList {
    [ownerId: string]: ICtdnItem
}

export interface ICtdnItem {
    [key: string]: ICtdn
}

export interface ICtdn {
    ownerId: IOwnerIDType,
    title: string,
    year: number,
    month: string,
    day: string,
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
