import {InlineKeyboardButton} from "node-telegram-bot-api";
import {EActions} from "../intrafaces/bot";

interface IInlineKeyboardButtonExtend extends InlineKeyboardButton {
    type: string;
}
export const newCountdownButton = [{text: 'Create New Countdown', callback_data: EActions.NEW_COUNTDOWN}] as InlineKeyboardButton[];

const date = new Date();
const year = date.getFullYear();
export const yearsButton = [[0,1,2,3,4,5].map(item => {
    const yearStr = year + item + '';
    return {text: yearStr, callback_data: 'year_' + yearStr};
})] as IInlineKeyboardButtonExtend[][];

export const monthButton = [
    [{text: 'January', callback_data: 'month_01'}, {text: 'February', callback_data: 'month_02'}, {text: 'March', callback_data: 'month_03'}],
    [{text: 'April', callback_data: 'month_04'}, {text: 'May', callback_data: 'month_05'}, {text: 'June', callback_data: 'month_06'}],
    [{text: 'July', callback_data: 'month_07'}, {text: 'August', callback_data: 'month_08'}, {text: 'September', callback_data: 'month_09'}],
    [{text: 'October', callback_data: 'month_10'}, {text: 'November', callback_data: 'month_11'}, {text: 'December', callback_data: 'month_12'}]
];

export const getDaysButton = (n: number) => {
    let result = [];
    const row = 6;
    let rowArray = [];
    for (let i = 0; i < n; i++) {
        if (i % row === 0 && i !== 0) {
            result.push(rowArray);
            rowArray = [];
        }
        rowArray.push({text: `${i + 1}`, callback_data: `day_0${i + 1}`});
        if (i === n - 1) {
            result.push(rowArray);
        }
    }
    return result as InlineKeyboardButton[][];
};

export const completeButton = [[{text: 'Ok', callback_data: 'complete_new_creation'}]];
