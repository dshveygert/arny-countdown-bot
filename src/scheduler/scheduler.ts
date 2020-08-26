import { ICtdn, IOwnerIDType, ISchedule, IScheduleList, ITime } from "../intrafaces/countdown";
import { schedulerApi } from "../firebase/scheduler";
import { AxiosResponse } from "axios";
import {countdownApi} from "../firebase/countdown";

class Scheduler {
    private getCurrentDate = (date: Date): string => `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

    private getList = (): Promise<AxiosResponse<IScheduleList>> => schedulerApi.getList().then(result => result?.data);

    private compareTime = (now: number, timeToCompare: number): boolean => now > timeToCompare;

    private getUserReminderTimeUTC = (date: Date, user: ITime): number => {
        const userReminderTime = new Date(`${this.getCurrentDate(date)} ${user.h}:${user.m}`);
        return userReminderTime.getTime()/1000;
    }

    private counter = (now: number, dateToCompare: string):number => Math.floor(((new Date(dateToCompare)).getTime()/1000 - now) / 60 /60 / 24);

    public newEvent(ownerId: IOwnerIDType, id: string, { year, month, day }: ICtdn): void {
        const event: ISchedule = {
            id,
            date: `${year}.${month}.${day}`,
            time: {h: 7, m: 0, zone: '0'}, // UTC = 7 AM, === 10 AM +3
            last_sended_date: Date.now()/1000
        };
        schedulerApi.postCountdownSchedule(ownerId, event);
    }

    public eventListTick(): Promise<any> {
        const now = new Date();
        const tickTimeUTC = Math.floor(Date.now() / 1000);
        return this.getList().then(result => {
            let remindersList: {ownerId:IOwnerIDType, id: string, countdown: number, scheduleId: string}[] = [];
            if (result && (typeof result === 'object' && Object.keys(result).length > 0)) {
                Object.keys(result).map(key => {
                    try {
                        // @ts-ignore
                        const scheduleList = result[key];
                        Object.keys(scheduleList).map(scheduleItem => {
                            const userTimeForRemind = this.getUserReminderTimeUTC(now, scheduleList[scheduleItem].time);
                            if (this.compareTime(tickTimeUTC, userTimeForRemind) && (!scheduleList[scheduleItem].last_sended_date || this.compareTime(tickTimeUTC, +scheduleList[scheduleItem].last_sended_date + 24 * 60 * 60))) {
                                remindersList.push({ownerId: key, id: scheduleList[scheduleItem].id, countdown: this.counter(tickTimeUTC, scheduleList[scheduleItem].date), scheduleId: scheduleItem});
                            }
                        })
                    } catch (e) {
                        console.log('[eventListTick]', e);
                    }
                })
            } else {
                console.log('Schedule is empty');
                return new Promise(resolve => resolve('Schedule is empty'))
            }

            if (remindersList.length > 0) {
                let reminder: any[] = [];
                return countdownApi.getList().then(result => {
                    remindersList.map(item => {
                        // @ts-ignore
                        const event = result?.data[item.ownerId][item.id];
                        reminder.push({...item, title: event.title, countdown: item.countdown});
                    })
                    return reminder;
                });
            } else {
                console.log('No events to remind');
                return new Promise(resolve => resolve('Empty'))
            }
        });
    }
}

export const scheduler = new Scheduler();
