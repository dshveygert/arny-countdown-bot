import { Api } from './api';
import { IOwnerIDType, ISchedule } from "../intrafaces/countdown";

class SchedulerApi extends Api {

    public getList() {
        return this.get('/schedule.json');
    }

    postCountdownSchedule(id: IOwnerIDType, data: ISchedule) {
        return this.post(`/schedule/${id}.json`, data);
    }

    patchCountdownSchedule(id: IOwnerIDType, scheduleId: string, data?: Partial<ISchedule>) {
        return this.patch(`/schedule/${id}/${scheduleId}.json`, data);
    }
}

export const schedulerApi = new SchedulerApi();
