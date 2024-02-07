import { NavigateFunction } from "react-router-dom";
import { ReactNode } from "react";
import * as _ from "lodash";
import {
  CommonFailResponse,
  CommonResponse,
  CommonSuccessResponse,
} from "@/apis/requests/types";
import { RESPONSE_CODE } from ".";

export function checkResponseSuccess<T>(
  res: CommonResponse,
): res is CommonSuccessResponse<T> {
  return res.code === RESPONSE_CODE.SUCCESS;
}

/**
 *
 * @param res 响应结果
 * @param onSuccess 成功回调
 * @param onFail 失败回调
 * @returns
 */
export function handleResponse<T>(
  res: CommonResponse<T>,
  onSuccess?: (res: CommonSuccessResponse<T>) => any,
  onFail?: (res: CommonFailResponse) => any,
) {
  return checkResponseSuccess<T>(res) ? onSuccess?.(res) : onFail?.(res);
}

/**
 * 确保元素为数组
 * @param arr 待检查数组
 * @returns
 */
export function ensureArray<T>(arr: T[] | T | undefined) {
  return arr ? (Array.isArray(arr) ? arr : [arr]) : [];
}

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

export const waitAndRefreshPage = async (
  navigate: NavigateFunction,
  time: number,
) => {
  await wait(time);
  navigate(0);
};

/** 格式化链接 */
export const formatDirection = (direction: string) => {
  return `https://${direction}`;
};

/** map 渲染通用 */
export function mapRender<T>(
  dataSource: T[] | T | undefined,
  renderFunc: (item: T) => ReactNode,
) {
  return ensureArray(dataSource).map((item) => renderFunc(item));
}

/** 条件渲染 */
export function conditionalRender(
  condition: any,
  onTrue?: () => ReactNode,
  onFalse?: () => ReactNode,
) {
  return condition ? onTrue?.() ?? null : onFalse?.() ?? null;
}

/** 生成iconfont className */
export const iconfontCx = (postfix?: string) => {
  return postfix ? `iconfont icon-${postfix}` : "";
};
