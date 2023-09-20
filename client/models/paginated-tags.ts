/* tslint:disable */
/* eslint-disable */
/**
 * esa API v1
 * チームのナレッジ共有サービス[esa.io](https://esa.io/)のAPI v1の仕様書
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Tag } from "./tag";

/**
 *
 * @export
 * @interface PaginatedTags
 */
export interface PaginatedTags {
  /**
   * Tagのリスト
   * @type {Array<Tag>}
   * @memberof PaginatedTags
   */
  tags: Array<Tag>;
  /**
   * 1つ前のpage番号。存在しない場合はnull
   * @type {number}
   * @memberof PaginatedTags
   */
  prev_page: number | null;
  /**
   * 1つ先のpage番号。存在しない場合はnull
   * @type {number}
   * @memberof PaginatedTags
   */
  next_page: number | null;
  /**
   * リソースの総数
   * @type {number}
   * @memberof PaginatedTags
   */
  total_count: number;
  /**
   * 現在のページ番号
   * @type {number}
   * @memberof PaginatedTags
   */
  page: number;
  /**
   * 1ページあたりに含まれる要素数
   * @type {number}
   * @memberof PaginatedTags
   */
  per_page: number;
  /**
   * per_pageに指定可能な数の最大値
   * @type {number}
   * @memberof PaginatedTags
   */
  max_per_page: number;
}
