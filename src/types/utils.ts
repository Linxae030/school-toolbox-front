/** 添加唯一标识 */
export type WithMongoId<T> = T & {
  /** 数据库中唯一标识 */
  _id: string;
};

/** 去除 account */
export type OmitAccount<T> = Omit<T, "account">;

export type ArrayType<T> = T extends (infer U)[] ? U : never;
