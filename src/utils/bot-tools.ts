import { IUid } from "../intrafaces/bot";
import { Message } from "node-telegram-bot-api";
import {ICtdn, ICtdnItem, IOwnerIDType} from "../intrafaces/countdown";
import {countdownApi} from "../firebase/countdown";

function getId(msg: Message | IUid): string {
    if (msg.hasOwnProperty('user')) {
        const chat = msg.chat ? msg.chat : 0;
        // @ts-ignore
        return `${msg.user}_${chat < 0 ? 'G_' + Math.abs(chat) : chat}`;
    } else {
        // @ts-ignore
        const from = msg.from && msg.from.id ? msg.from.id : 'NoFromID';
        // @ts-ignore
        const chat = msg.chat && msg.chat.id ? msg.chat.id : 0;
        return `${from}_${chat < 0 ? 'G_' + Math.abs(chat) : chat}`;
    }
}

function getDaysInMonth(month: string, year: number): number {
    return new Date(year, Number(month), 0).getDate();
}

function objectFilter(obj: ICtdnItem, condition: (i: any) => {}): ICtdnItem {
    let result = {} as ICtdnItem, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key) && condition(obj[key])) {
            result[key] = obj[key];
        }
    }
    return result;
}

function objectSort(obj: ICtdnItem): ICtdnItem {
    function sortF(a: ICtdn, b: ICtdn) {
        return Number(`${a.year}${a.month}${a.day}`) - Number(`${b.year}${b.month}${b.day}`);
    }
    const resultObj = {};
    // @ts-ignore
    const resultArr = Object.keys(obj).map(item => ({...obj[item], id: item})).sort(sortF).map(item => resultObj[item.id] = item);
    return resultObj;
}

function getCountdownList(ownerId: IOwnerIDType, completed = false) {
    return countdownApi.getListByID(ownerId).then(result => {
        // console.log('[LIST]', result.data);
        const filter = (item: any) => item.complete === completed || (!completed && !item.complete);
        return objectFilter(result.data, filter);
    });
}

function countdownListString(countdown: ICtdn): string {
    return `${countdown.day}.${countdown.month}.${countdown.year} - ${countdown.title}`;
}

export {
    getId,
    getDaysInMonth,
    objectFilter,
    getCountdownList,
    countdownListString,
    objectSort
}
