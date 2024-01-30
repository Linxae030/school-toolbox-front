import {
  CommonFailResponse,
  CommonResponse,
  CommonSuccessResponse,
} from "@/apis/requests/types";
import { RESPONSE_CODE } from ".";

export const checkResponseSuccess = <T>(
  res: CommonResponse,
): res is CommonSuccessResponse<T> => {
  return res.code === RESPONSE_CODE.SUCCESS;
};

/**
 *
 * @param res 响应结果
 * @param onSuccess 成功回调
 * @param onFail 失败回调
 * @returns
 */
export const handleResponse = <T>(
  res: CommonResponse<T>,
  onSuccess?: (res: CommonSuccessResponse<T>) => any,
  onFail?: (res: CommonFailResponse) => any,
) => {
  return checkResponseSuccess<T>(res) ? onSuccess?.(res) : onFail?.(res);
};

/**
 * 确保元素为数组
 * @param arr 待检查数组
 * @returns
 */
export const ensureArray = <T>(arr: T[]) =>
  arr ? (Array.isArray(arr) ? arr : [arr]) : [];

/**
 * 等待
 * @param time 时间（秒）
 * @returns
 */
export const wait = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, time * 1000);
  });
};
