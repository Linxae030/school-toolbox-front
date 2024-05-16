import axios from "axios";
import type { AxiosInstance } from "axios";
import type {
  CommonResponse,
  CustomInsInterceptors,
  CustomInsConfig,
  CustomSingleConfig,
} from "./types";
import {
  TOKEN_NAME_IN_LOCAL,
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@/utils";

export default class AxiosApi {
  instance: AxiosInstance;

  interceptors?: CustomInsInterceptors;

  constructor(config: CustomInsConfig) {
    this.instance = axios.create(config);
    this.interceptors = config.interceptors;

    // 实例请求拦截器
    this.instance.interceptors.request.use(
      // @ts-expect-error 有点问题
      this.interceptors?.reqInterceptor,
      this.interceptors?.reqInterceptorCatch,
    );

    // 实例响应拦截器
    this.instance.interceptors.response.use(
      this.interceptors?.resInterceptor,
      this.interceptors?.resInterceptorCatch,
    );

    // 所有实例的请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        const token = getLocalStorageItem(TOKEN_NAME_IN_LOCAL);
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      (err) => {
        return err;
      },
    );
    // 所有实例的响应拦截器
    this.instance?.interceptors.response.use(
      (res) => {
        return res.data;
      },
      (err) => {
        const receivedData = err.response?.data;
        const { code, status } = receivedData ?? {};
        console.log("err", err);
        if (code === 0 && status === 401) {
          removeLocalStorageItem(TOKEN_NAME_IN_LOCAL);
        }
        return receivedData;
      },
    );
  }

  /**
   * 统一请求入口封装，可传入单次请求拦截器
   * @param config:LinReqConfig<T>
   * @returns Promise<T>
   */
  request<T, R = CommonResponse<T>>(config: CustomSingleConfig<T>): Promise<R> {
    // 请求应当返回promise对象，可使用then/await等进行后续处理
    let innerConfig = config;
    const promise = new Promise<R>((resolve, reject) => {
      if (config.interceptors?.reqInterceptor) {
        // 取出单次请求传入的请求拦截器
        const reqInterceptor = config.interceptors?.reqInterceptor;
        // 配置传入单次请求拦截器处理
        innerConfig = reqInterceptor(config);
      }

      // 以config配置发起请求
      this.instance.request<T, R>(innerConfig).then(
        (res) => {
          if (config.interceptors?.resInterceptor) {
            // 取出单次请求传入响应的拦截器
            const resInterceptor = config.interceptors?.resInterceptor;
            // 结果传入单次响应拦截器处理后返回
            // @ts-expect-error 有点问题
            const temp = resInterceptor(res);
            return temp;
          }

          return resolve(res);
        },
        (err) => {
          reject(err);
        },
      );
    });
    return promise;
  }

  get<T>(url: string, config?: CustomSingleConfig<T>) {
    return this.request<T>({ ...config, method: "GET", url });
  }

  post<T>(url: string, config?: CustomSingleConfig<T>) {
    return this.request<T>({ ...config, method: "POST", url });
  }
}
