import {IAuth} from "../interfaces/firebase";
import {store} from '../store/store';
import * as config from "../config.json";
import {authApi} from "./authApi";
import {updateAuthData} from "../store/actions";

export const isAuthorised = (): boolean => {
    const { auth } = store.getState().auth;
    const now = Date.now();
    if (auth.idToken && auth.idToken.length > 0 && auth.updated_at && ((now - auth.updated_at) / 1000 < (Number(auth.expiresIn) - 120))) {
        return true;
    } else {
        return false;
    }
}

export const getAuthToken = async (): Promise<string> => {
    const { auth } = store.getState().auth;
    const authData = isAuthorised() ? auth : await authorise();
    return isAuthorised() ? auth.idToken : authData.idToken;
}

export const getAuthorisationParams = (): string => {
    const {firebase} = config;
    return `?email=${firebase.user_email}&password=${firebase.password}&returnSecureToken=true&key=${firebase.api_key}`;
}

// @ts-ignore
export const authorise = async (): Promise<IAuth> => {
    try {
        // @ts-ignore
        const token = await authApi.auth(getAuthorisationParams());
        // @ts-ignore
        store.dispatch(updateAuthData(token?.data));
        return token?.data as unknown as IAuth || {};
    } catch (e) {
        console.log('[authorise error]', e);
    }
}
