import { Api } from './api';

class CountdownApi extends Api {
    public getList() {
        return this.get('/countdown.json');
    }

    postCountdown(id: string, data?: any) {
        return this.post(`/countdown/${id}.json`, data);
    }

    patchCountdown(id: string, data?: any) {
        return this.post(`/countdown/${id}.json`, data);
    }
}

export const countdownApi = new CountdownApi();
