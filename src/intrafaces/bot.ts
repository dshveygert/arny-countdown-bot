import TelegramBot, {InlineKeyboardButton, Message} from "node-telegram-bot-api";

export interface IMessage {
  msg: Message,
  text: string,
  button: InlineKeyboardButton[]
}

export interface IBotMessage {
  chatId: number | string,
  text: string,
  options?: TelegramBot.SendMessageOptions
}

export enum EActions {
  NEW_COUNTDOWN = 'create_new_countdown',
  SET_YEAR = 'set_year',
  SET_MONTH = 'set_month',
  SET_DAY = 'set_dat',
  COMPLETE_CREATION = 'complete_new_creation'
}

export enum EBotCommands {
  START = '/start',
  GET_LIST = '/list',
  GET_LIST_COMPLETED = '/completed'
}

export interface IUid {
  user: number,
  chat: number | string
}
