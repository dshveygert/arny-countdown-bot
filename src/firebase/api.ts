import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import * as config from '../config.json';

export class Api {
  private axiosInstance: AxiosInstance;
  constructor() {
    const header = {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    }
    const axiosInstance = axios.create({...header});
    axiosInstance.interceptors.request.use(this.requestHandler, this.handleError);
    axiosInstance.interceptors.response.use(this.responseHandler, this.handleError);
    this.axiosInstance = axiosInstance;
  }

  private requestHandler = (config: AxiosRequestConfig) => {
    // Do something before request is sent
    return config;
  }
  private responseHandler = (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }

  handleError = (error: AxiosError) => {
    Api.log(error);
    return Promise.reject(error)
  };

  private static log(error?: AxiosError) {
    return console.log('\n\n [Error interceptor] \n\n', error);
  }

  get apiUrl() {
    return config.firebase.db_url;
  }

  public get(path: string, params?: AxiosRequestConfig) {
    return this.axiosInstance.get(`${this.apiUrl}${path}`, params);
  }

  public post(path: string, payload: any) {
    return this.axiosInstance.request({
      method: 'POST',
      url: `${this.apiUrl}${path}`,
      responseType: 'json',
      data: payload
    });
  }

  public patch(path: string, payload: any) {
    return this.axiosInstance.request({
      method: 'PATCH',
      url: `${this.apiUrl}${path}`,
      responseType: 'json',
      data: payload
    });
  }

  public delete(path: string) {
    return this.axiosInstance.request({
      method: 'DELETE',
      url: `${this.apiUrl}${path}`,
      responseType: 'json'
    });
  }
}

export const api = new Api();
