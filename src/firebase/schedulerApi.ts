import { Api } from './api';
import { IOwnerIDType, ISchedule } from "../interfaces/countdown";
import {getAuthToken, isAuthorised, authorise} from './auth';

class SchedulerApi extends Api {

    public async getList() {
        console.log('isAuthorised=====>', isAuthorised());
        const token = await getAuthToken();
        return this.get(`/schedule.json?auth=${token}`);
    }

    public async postCountdownSchedule(id: IOwnerIDType, data: ISchedule) {
        const token = await getAuthToken();
        return this.post(`/schedule/${id}.json?auth=${token}`, data);
    }

    public async patchCountdownSchedule(id: IOwnerIDType, scheduleId: string, data?: Partial<ISchedule>) {
        const token = await getAuthToken();
        return this.patch(`/schedule/${id}/${scheduleId}.json?auth=${token}`, data);
    }

    public async deleteScheduleItem(id: IOwnerIDType, scheduleId: string) {
        const token = await getAuthToken();
        return this.delete(`/schedule/${id}/${scheduleId}.json?auth=${token}`);
    }
}

export const schedulerApi = new SchedulerApi();
