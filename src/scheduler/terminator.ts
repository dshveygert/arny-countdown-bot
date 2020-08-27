import * as config from "../config.json";
import {ICtdn, ICtdnItem, IScheduleItem, IOwnerIDType} from "../intrafaces/countdown";
import {schedulerApi} from "../firebase/scheduler";
import {countdownApi} from "../firebase/countdown";

interface IScheduleToDelete {
    ownerId: IOwnerIDType,
    schedule: IScheduleItem,
    scheduleId: string
}

class Terminator {

    private getScheduleList = () => schedulerApi.getList().then(result => result?.data);

    private isEventToComplete = (event: ICtdn, now: number): boolean => {
        if (event.complete) return false;
        const eventDate = (new Date(`${event.year}.${event.month}.${event.day} 00:00`)).getTime()/1000;
        return now > (eventDate + config.period_to_compare_sec);
    }

    private getListToComplete = async (now: number) => {
        try {
            const listToComplete: ICtdnItem[] = [];
            const eventsList = await countdownApi.getList();

            if (eventsList && eventsList.data) {
                Object.keys(eventsList.data).map(ownerId => {
                    const eventsOfOwner = eventsList.data[ownerId];
                    Object.keys(eventsOfOwner).map(eventId => {
                        const isToComplete = this.isEventToComplete(eventsOfOwner[eventId], now);
                        if (isToComplete) {
                            listToComplete.push({[eventId]: eventsOfOwner[eventId]});
                        }
                    })
                })
            }

            return listToComplete;
        } catch (e) {
            console.log('[getListToComplete]', e);
        }
    }

    private getSchedulesToDelete = async (events: ICtdnItem[] = []) => {
        try {
            const schedulesList = await this.getScheduleList() || [];
            const result: IScheduleToDelete[] = [];
            events.map((item: ICtdnItem) => {
                const eventId = Object.keys(item)[0];
                const ownerId = item[eventId].ownerId;
                if (schedulesList && schedulesList.hasOwnProperty(ownerId)) {
                    const scheduleObj = schedulesList[ownerId];
                    Object.keys(scheduleObj).map(scheduleId => {
                        if(scheduleObj[scheduleId].id === eventId) {
                            result.push({ownerId: ownerId, schedule: {[scheduleId]: scheduleObj[scheduleId]}, scheduleId})
                        }
                    })
                }
            });

            return result;
        } catch (e) {
            console.log('[getSchedulesToDelete]', e);
        }
    }

    public completeOldEvents = async () => {
        try {
            const now = Date.now()/1000;
            const listToComplete = await this.getListToComplete(now) || [];
            if (listToComplete.length > 0) {
                const schedulesToDelete = await this.getSchedulesToDelete(listToComplete) || [];
                listToComplete.map((item: ICtdnItem) => {
                    const eventId = Object.keys(item)[0];
                    const ownerId = item[eventId].ownerId;
                    countdownApi.patchCountdown(ownerId, eventId, {complete: true, updated: now});
                });
                schedulesToDelete.map((item: IScheduleToDelete) => {
                    schedulerApi.deleteScheduleItem(item.ownerId, item.scheduleId);
                });
            }
        } catch (e) {
            console.log('[completeOldEvents]', e);
        }

    }
}

export const terminator = new Terminator();
