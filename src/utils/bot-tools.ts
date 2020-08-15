import { IUid } from "../intrafaces/bot";
import { Message } from "node-telegram-bot-api";

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
        console.log('chatchatchat', chat, typeof chat, chat < 0);
        return `${from}_${chat < 0 ? 'G_' + Math.abs(chat) : chat}`;
    }
}

function getDaysInMonth(month: number, year: number): number {
    return new Date(year, month, 0).getDate();
}

export {
    getId,
    getDaysInMonth
}
