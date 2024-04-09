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
  onSuccess?: (res: CommonSuccessResponse<T>) => void,
  onFail?: (res: CommonFailResponse) => void,
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
  renderFunc: (item: T, index?: number) => ReactNode,
) {
  return ensureArray(dataSource).map((item, index) => renderFunc(item, index));
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

export const formatISO = (timestamp: string) => {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedTime;
};

/**
 *
 * @param number
 * @returns 转化后的时间
 * @example 6 -> 6:00
 */
export function convertToTime(number: number) {
  const hour = Math.floor(number);
  const minutes = (number - hour) * 60;
  const formattedMinutes = String(minutes).padStart(2, "0");
  return `${hour}:${formattedMinutes}`;
}

export function ellipsis(value: string, len: number) {
  if (!value) return "";
  return value.length > len ? `${value.slice(0, len)}...` : value;
}

export function bytesToSize(size: number | string) {
  if (_.isString(size)) return;
  if (size < 0.1 * 1024) {
    // 小于0.1KB，则转化成B
    size = `${size.toFixed(2)}B`;
  } else if (size < 0.1 * 1024 * 1024) {
    // 小于0.1MB，则转化成KB
    size = `${(size / 1024).toFixed(2)}KB`;
  } else if (size < 0.1 * 1024 * 1024 * 1024) {
    // 小于0.1GB，则转化成MB
    size = `${(size / (1024 * 1024)).toFixed(2)}MB`;
  } else {
    // 其他转化成GB
    size = `${(size / (1024 * 1024 * 1024)).toFixed(2)}GB`;
  }

  // 转成字符串
  const sizeStr = `${size}`;
  // 获取小数点处的索引
  const index = sizeStr.indexOf(".");
  // 获取小数点后两位的值
  const dou = sizeStr.substring(index + 1, 2);

  // 判断后两位是否为00，如果是则删除00
  if (dou === "00")
    return sizeStr.substring(0, index) + sizeStr.substring(index + 3, 2);

  return size;
}

/** 提取文件后缀 */
export function extractFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === filename.length - 1) {
    return ""; // 没有找到后缀或者文件名以点结尾，返回空字符串
  }
  return filename.substring(lastDotIndex + 1);
}
