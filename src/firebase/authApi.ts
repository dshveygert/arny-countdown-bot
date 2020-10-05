import { Api } from './api';
import {ICtdnList} from "../interfaces/countdown";
import {AxiosResponse} from "axios";

class AuthApi extends Api {

    public auth(data: string): Promise<AxiosResponse<ICtdnList>> {
        return this.post(data, {}, this.apiAuthUrl);
    }
}

export const authApi = new AuthApi();
