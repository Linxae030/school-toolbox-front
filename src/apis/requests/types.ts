/* eslint-disable @typescript-eslint/no-explicit-any */

import { AxiosResponse, HttpStatusCode, AxiosRequestConfig } from "axios";

export interface CommonSuccessResponse<T = Record<string, any>> {
  /** 1成功 0失败 */
  code: 1;
  msg: string;
  data: T;
}

export interface CommonFailResponse {
  /** 1成功 0失败 */
  code: 0;
  ret: string;
  status: HttpStatusCode;
  time: string;
  path: string;
}

export type CommonResponse<T> = CommonSuccessResponse<T> | CommonFailResponse;

// 响应拦截器默认采用AxiosResponse类型，如传入
export interface CustomInsInterceptors<T = any> {
  reqInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  reqInterceptorCatch?: (error: any) => any;
  resInterceptor?: (res: AxiosResponse<T>) => T;
  resInterceptorCatch?: (error: any) => any;
}

export interface CustomSingleInterceptors<T = any> {
  reqInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  reqInterceptorCatch?: (error: any) => any;
  resInterceptor?: (res: CommonResponse<T>) => T;
  resInterceptorCatch?: (error: any) => any;
}

export interface CustomInsConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: CustomInsInterceptors<T>;
}

export interface CustomSingleConfig<T = AxiosResponse>
  extends AxiosRequestConfig {
  interceptors?: CustomSingleInterceptors<T>;
}
