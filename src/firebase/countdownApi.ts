import { Api } from './api';
import {ICtdnList, IOwnerIDType} from "../interfaces/countdown";
import {AxiosResponse} from "axios";
import {getAuthToken} from "./auth";

class CountdownApi extends Api {

    public async getList(): Promise<AxiosResponse<ICtdnList>> {
        const token = await getAuthToken();
        return this.get(`/countdown.json?auth=${token}`);
    }

    public async getListByID(id: IOwnerIDType) {
        const token = await getAuthToken();
        return this.get(`/countdown/${id}.json?auth=${token}`);
    }

    public async postCountdown(id: IOwnerIDType, data?: any) {
        const token = await getAuthToken();
        console.log('\n\n\n',);
        console.log('postCountdown', data);
        console.log('\n\n\n',);
        return this.post(`/countdown/${id}.json?auth=${token}`, data);
    }

    public async patchCountdown(id: IOwnerIDType, eventId: string, data?: any) {
        const token = await getAuthToken();
        return this.patch(`/countdown/${id}/${eventId}.json?auth=${token}`, data);
    }
}

export const countdownApi = new CountdownApi();
