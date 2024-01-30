import { LinkIconDisplayModeEnum } from "@/utils";
import { OmitAccount, WithMongoId } from "@/types";

export interface Link {
  /** 所属用户 */
  account: string;
  /** 链接名 */
  name: string;
  /** 链接指向 */
  direction: string;
  /** 所属分类 */
  categoryId: string;
  /** 背景颜色 */
  bgColor: string;
  /** 链接图标展示方式 */
  displayMode: LinkIconDisplayModeEnum;
}

export interface LinkCate {
  /** 所属用户 */
  account: string;
  /** 分类名 */
  name: string;
  /** 分类中包含的链接 */
  links: Link[];
}
export type UpdateLinkRes = WithMongoId<Link>;
export type UpdateCateRes = WithMongoId<LinkCate>;
export type FindAllCateRes = WithMongoId<LinkCate>[];

export type CreateLinkPayload = Link;
export type CreateCatePayload = Pick<LinkCate, "name">;
export type UpdateLinkPayload = Partial<OmitAccount<Link>>;
export type UpdateCatePayload = Partial<OmitAccount<LinkCate>>;