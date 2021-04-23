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

import { NewPost } from "./new-post";

/**
 * 新たに投稿する記事を含んだリクエストボディです。
 * @export
 * @interface CreatePostBody
 */
export interface CreatePostBody {
  /**
   *
   * @type {NewPost}
   * @memberof CreatePostBody
   */
  post: NewPost;
}
