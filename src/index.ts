import TelegramBot, {Message} from 'node-telegram-bot-api';
import {store} from './store/store';

import * as config from "./config.json";
import {monthButton, newCountdownButton, yearsButton, getDaysButton, completeButton} from "./utils/buttons";
import {EActions} from "./intrafaces/bot";
import {newCountdown, newCountdownCreated} from './store/actions';
import {EQueue} from "./intrafaces/countdown";
import {getId, getDaysInMonth} from './utils/bot-tools';
import {queue} from "./store/reducer";

const bot = new TelegramBot(config.telegram_bot.token, {polling: true});
bot.on("polling_error", (err: any) => err ? console.log(err) : console.log('No errors'));

bot.onText(/\/start/, (msg: Message) => {
    bot.sendMessage(msg.chat.id, 'Lets start creating your new Countdown.', {
        reply_markup: {
            inline_keyboard: [newCountdownButton]
        }
    });
});


// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;

    if (msg) {
        const actionModified = action?.startsWith('year_')
            ? EActions.SET_YEAR
            : action?.startsWith('month_')
            ? EActions.SET_MONTH
            : action?.startsWith('day_')
            ? EActions.SET_DAY
            : action;

        const countdownOwnerId = getId({user: callbackQuery.from.id, chat: msg.chat.id});

        switch (actionModified) {
            case EActions.NEW_COUNTDOWN:
                // @ts-ignore
                store.dispatch(newCountdown(countdownOwnerId, EQueue.START, {}));
                bot.sendMessage(msg.chat.id, 'Tape the Countdowns title (Your goal, dreams, event or task).');
                break;
            case EActions.SET_YEAR:
                // @ts-ignore
                store.dispatch(newCountdown(countdownOwnerId, EQueue.YEAR, {year: Number(action?.replace('year_', ''))}));
                bot.sendMessage(msg.chat.id, 'Set the Month:', {
                    reply_markup: {
                        inline_keyboard: monthButton
                    }
                })
                break;
            case EActions.SET_MONTH:
                const month = Number(action?.replace('month_', ''));
                const year = store.getState().newCountdownStartedList[countdownOwnerId]?.data?.year;
                // @ts-ignore
                store.dispatch(newCountdown(countdownOwnerId, EQueue.MONTH, {month}));
                bot.sendMessage(msg.chat.id, 'Set the Day:', {
                    reply_markup: {
                        inline_keyboard: getDaysButton(getDaysInMonth(month, year))
                    }
                })
                break;
            case EActions.SET_DAY:
                // @ts-ignore
                store.dispatch(newCountdown(countdownOwnerId, EQueue.DAY, {day: Number(action?.replace('day_', ''))}));
                bot.sendMessage(msg.chat.id, 'Excellent! Countdown has been created. \nIt will remind you every day at 10:00 AM. \nIf you want to change time - write it in format *hh:mm*. If not - push the "Ok" button.', {parse_mode: 'HTML'}).then(_ => {
                    bot.sendMessage(msg.chat.id, 'Tape the time ( *hh:mm* ) or click "Ok".', {
                        reply_markup: {
                            inline_keyboard: completeButton
                        },
                        parse_mode: 'HTML'
                    })
                });
                break;
            case EActions.COMPLETE_CREATION:
                // @ts-ignore
                store.dispatch(newCountdown(countdownOwnerId, EQueue.END, {}));
                const title = store.getState().newCountdownStartedList[countdownOwnerId]?.data?.title;
                bot.sendMessage(msg.chat.id, `Countdown "${title}" fully created.`);
                // @ts-ignore
                store.dispatch(newCountdownCreated(countdownOwnerId));
                break;
            default:
                console.log('No ACTIONS ');
        }
        // console.log('\n \n store After Actions', JSON.stringify(store.getState()));
        // console.log('\n\n');
    } else {
        throw Error('[callback_query]');
    }
});

bot.on('message', (msg) => {
    const { newCountdownStartedList } = store.getState();
    const id = getId(msg);
    if (newCountdownStartedList.hasOwnProperty(id)) {
        const nextPeriod = queue.indexOf(newCountdownStartedList[id].queue) + 1;
        if (queue[nextPeriod] === EQueue.TITLE) {
            const data = {
                [queue[nextPeriod]]: msg.text,
                created: msg.date,
                ownerId: id
            };
            // @ts-ignore
            store.dispatch(newCountdown(getId(msg), queue[nextPeriod] as EQueue, data));
            bot.sendMessage(msg.chat.id, 'Now it is necessary to set the date of your goal.').then(_ => {
                bot.sendMessage(msg.chat.id, 'First, set the Year:', {
                    reply_markup: {
                        inline_keyboard: yearsButton
                    }
                })
            });
        }
    }
});
