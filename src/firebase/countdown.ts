import { Api } from './api';
import { IOwnerIDType } from "../intrafaces/countdown";

class CountdownApi extends Api {

    public getList() {
        return this.get('/countdown.json');
    }

    public getListByID(id: IOwnerIDType) {
        return this.get(`/countdown/${id}.json`);
    }

    postCountdown(id: IOwnerIDType, data?: any) {
        return this.post(`/countdown/${id}.json`, data);
    }

    patchCountdown(id: IOwnerIDType, data?: any) {
        return this.patch(`/countdown/${id}.json`, data);
    }
}

export const countdownApi = new CountdownApi();
