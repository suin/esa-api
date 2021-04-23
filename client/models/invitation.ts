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

/**
 * Emailによる招待を表します。
 * @export
 * @interface Invitation
 */
export interface Invitation {
  /**
   * 招待したEメールアドレスです
   * @type {string}
   * @memberof Invitation
   */
  email: string;
  /**
   * 招待の識別子です  削除時に利用します
   * @type {string}
   * @memberof Invitation
   */
  code: string;
  /**
   * 招待の有効期限です
   * @type {string}
   * @memberof Invitation
   */
  expires_at: string;
  /**
   * 招待されたメンバーがチームへ参加する際に使うURLです
   * @type {string}
   * @memberof Invitation
   */
  url: string;
}
