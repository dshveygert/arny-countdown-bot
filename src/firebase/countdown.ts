import { Api } from './api';
import {ICtdnList, IOwnerIDType} from "../intrafaces/countdown";
import {AxiosResponse} from "axios";

class CountdownApi extends Api {

    public getList(): Promise<AxiosResponse<ICtdnList>> {
        return this.get('/countdown.json');
    }

    public getListByID(id: IOwnerIDType) {
        return this.get(`/countdown/${id}.json`);
    }

    postCountdown(id: IOwnerIDType, data?: any) {
        return this.post(`/countdown/${id}.json`, data);
    }

    patchCountdown(id: IOwnerIDType, eventId: string, data?: any) {
        return this.patch(`/countdown/${id}/${eventId}.json`, data);
    }
}

export const countdownApi = new CountdownApi();
