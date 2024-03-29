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

import globalAxios, { AxiosPromise, AxiosInstance } from "axios";
import { Configuration } from "../configuration";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from "../common";
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from "../base";
// @ts-ignore
import { AuthenticatedUser } from "../models";
/**
 * UserApi - axios parameter creator
 * @export
 */
export const UserApiAxiosParamCreator = function (
  configuration?: Configuration,
) {
  return {
    /**
     * 現在のアクセストークンで認証中のユーザーの情報を取得します。
     * @summary 認証中のユーザーを取得する
     * @param {'teams'} [include] teams を指定すると所属するチームの配列を含んだレスポンスを返します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAuthenticatedUser: async (
      include?: "teams",
      options: any = {},
    ): Promise<RequestArgs> => {
      const localVarPath = `/user`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication AccessTokenHeader required
      // http bearer authentication required
      await setBearerAuthToObject(localVarHeaderParameter, configuration);

      // authentication AccessTokenQueryParam required
      await setApiKeyToObject(
        localVarQueryParameter,
        "access_token",
        configuration,
      );

      // authentication OAuth2 required
      // oauth required
      await setOAuthToObject(
        localVarHeaderParameter,
        "OAuth2",
        ["read"],
        configuration,
      );

      if (include !== undefined) {
        localVarQueryParameter["include"] = include;
      }

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * UserApi - functional programming interface
 * @export
 */
export const UserApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = UserApiAxiosParamCreator(configuration);
  return {
    /**
     * 現在のアクセストークンで認証中のユーザーの情報を取得します。
     * @summary 認証中のユーザーを取得する
     * @param {'teams'} [include] teams を指定すると所属するチームの配列を含んだレスポンスを返します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getAuthenticatedUser(
      include?: "teams",
      options?: any,
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string,
      ) => AxiosPromise<AuthenticatedUser>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.getAuthenticatedUser(include, options);
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration,
      );
    },
  };
};

/**
 * UserApi - factory interface
 * @export
 */
export const UserApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance,
) {
  const localVarFp = UserApiFp(configuration);
  return {
    /**
     * 現在のアクセストークンで認証中のユーザーの情報を取得します。
     * @summary 認証中のユーザーを取得する
     * @param {'teams'} [include] teams を指定すると所属するチームの配列を含んだレスポンスを返します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getAuthenticatedUser(
      include?: "teams",
      options?: any,
    ): AxiosPromise<AuthenticatedUser> {
      return localVarFp
        .getAuthenticatedUser(include, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * Request parameters for getAuthenticatedUser operation in UserApi.
 * @export
 * @interface UserApiGetAuthenticatedUserRequest
 */
export interface UserApiGetAuthenticatedUserRequest {
  /**
   * teams を指定すると所属するチームの配列を含んだレスポンスを返します。
   * @type {'teams'}
   * @memberof UserApiGetAuthenticatedUser
   */
  readonly include?: "teams";
}

/**
 * UserApi - object-oriented interface
 * @export
 * @class UserApi
 * @extends {BaseAPI}
 */
export class UserApi extends BaseAPI {
  /**
   * 現在のアクセストークンで認証中のユーザーの情報を取得します。
   * @summary 認証中のユーザーを取得する
   * @param {UserApiGetAuthenticatedUserRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof UserApi
   */
  public getAuthenticatedUser(
    requestParameters: UserApiGetAuthenticatedUserRequest = {},
    options?: any,
  ) {
    return UserApiFp(this.configuration)
      .getAuthenticatedUser(requestParameters.include, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
