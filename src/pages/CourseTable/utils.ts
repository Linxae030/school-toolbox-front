import { SECOND_PER_MINUTE, BASE_HOUR } from "./constants";

/**
 * @description 把时间偏移量转换为时间字符串
 * @param offset
 * @returns {string}
 * @example convertTimeOffsetToTimeString(0) => "08:00"
 */
export const convertTimeOffsetToTimeString = (offset: number) => {
  const baseHour = `${
    Math.floor(offset / SECOND_PER_MINUTE) + BASE_HOUR
  }`.padStart(2, "0");
  const baseMinute = `${Math.floor(offset % SECOND_PER_MINUTE)}`.padStart(
    2,
    "0",
  );
  return `${baseHour}:${baseMinute}`;
};
