import { HttpErrorHandler } from './httpErrorHandler';
import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';

export class HttpService {
  httpInstance: AxiosInstance;

  constructor(baseURL?: string) {
    const config: AxiosRequestConfig = {
      baseURL: baseURL || import.meta.env.BASE_URL || '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    };

    this.httpInstance = axios.create(config);

    this.httpInstance.interceptors.request.use(
      (request) => request,
      error => HttpErrorHandler.errorResponseHandler(error),
    );

    this.httpInstance.interceptors.response.use(
      response => response,
      error => HttpErrorHandler.errorResponseHandler(error),
    );
  }
}
