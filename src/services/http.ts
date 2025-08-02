import { HttpErrorHandler } from './httpErrorHandler';
import axios, { type AxiosInstance, type AxiosResponse, type AxiosRequestConfig } from 'axios';

export class HttpService {
  private httpInstance: AxiosInstance;

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
      (request) => {
        console.log(`Making HTTP request: ${request.method?.toUpperCase()} ${request.url}`);
        return request;
      },
      error => HttpErrorHandler.errorResponseHandler(error),
    );

    this.httpInstance.interceptors.response.use(
      response => response,
      error => HttpErrorHandler.errorResponseHandler(error),
    );
  }

  public async get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.httpInstance.get(url, config);
    return response.data;
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.httpInstance.post(url, data, config);
    return response.data;
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.httpInstance.put(url, data, config);
    return response.data;
  }

  public async delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.httpInstance.delete(url, config);
    return response.data;
  }

  public async getText(url: string, config?: AxiosRequestConfig): Promise<string> {
    const response: AxiosResponse<string> = await this.httpInstance.get(url, {
      ...config,
      responseType: 'text',
    });
    return response.data;
  }
}

export default HttpService;
