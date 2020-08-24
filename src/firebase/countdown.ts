import { Api } from './api';
import { IOwnerIDType } from "../intrafaces/countdown";

class CountdownApi extends Api {

    public getList() {
        return this.get('/countdown.json');
    }

    public getListByID(id: IOwnerIDType) {
        return this.get(`/countdown/${id}.json`);
    }

    postCountdown(id: string, data?: any) {
        return this.post(`/countdown/${id}.json`, data);
    }

    patchCountdown(id: string, data?: any) {
        return this.post(`/countdown/${id}.json`, data);
    }
}

export const countdownApi = new CountdownApi();
