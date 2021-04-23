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

import { Post } from "./post";

/**
 *
 * @export
 * @interface PaginatedPosts
 */
export interface PaginatedPosts {
  /**
   * Postのリスト
   * @type {Array<Post>}
   * @memberof PaginatedPosts
   */
  posts: Array<Post>;
  /**
   * 1つ前のpage番号。存在しない場合はnull
   * @type {number}
   * @memberof PaginatedPosts
   */
  prev_page: number | null;
  /**
   * 1つ先のpage番号。存在しない場合はnull
   * @type {number}
   * @memberof PaginatedPosts
   */
  next_page: number | null;
  /**
   * リソースの総数
   * @type {number}
   * @memberof PaginatedPosts
   */
  total_count: number;
  /**
   * 現在のページ番号
   * @type {number}
   * @memberof PaginatedPosts
   */
  page: number;
  /**
   * 1ページあたりに含まれる要素数
   * @type {number}
   * @memberof PaginatedPosts
   */
  per_page: number;
  /**
   * per_pageに指定可能な数の最大値
   * @type {number}
   * @memberof PaginatedPosts
   */
  max_per_page: number;
}
