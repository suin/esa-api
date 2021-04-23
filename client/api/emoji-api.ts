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
import { CreateEmojiBody } from "../models";
// @ts-ignore
import { CreatedEmoji } from "../models";
// @ts-ignore
import { EmojiList } from "../models";
/**
 * EmojiApi - axios parameter creator
 * @export
 */
export const EmojiApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     * 新しい絵文字を登録します。
     * @summary 絵文字を登録する
     * @param {string} teamName チーム名
     * @param {CreateEmojiBody} createEmojiBody
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createEmoji: async (
      teamName: string,
      createEmojiBody: CreateEmojiBody,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'teamName' is not null or undefined
      assertParamExists("createEmoji", "teamName", teamName);
      // verify required parameter 'createEmojiBody' is not null or undefined
      assertParamExists("createEmoji", "createEmojiBody", createEmojiBody);
      const localVarPath = `/teams/{team_name}/emojis`.replace(
        `{${"team_name"}}`,
        encodeURIComponent(String(teamName))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "POST",
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
        configuration
      );

      // authentication OAuth2 required
      // oauth required
      await setOAuthToObject(
        localVarHeaderParameter,
        "OAuth2",
        ["write"],
        configuration
      );

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        createEmojiBody,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     * 登録したチーム固有の絵文字を削除します。
     * @summary 絵文字を削除する
     * @param {string} teamName チーム名
     * @param {string} code 絵文字コード
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteEmoji: async (
      teamName: string,
      code: string,
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'teamName' is not null or undefined
      assertParamExists("deleteEmoji", "teamName", teamName);
      // verify required parameter 'code' is not null or undefined
      assertParamExists("deleteEmoji", "code", code);
      const localVarPath = `/teams/{team_name}/emojis/{code}`
        .replace(`{${"team_name"}}`, encodeURIComponent(String(teamName)))
        .replace(`{${"code"}}`, encodeURIComponent(String(code)));
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "DELETE",
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
        configuration
      );

      // authentication OAuth2 required
      // oauth required
      await setOAuthToObject(
        localVarHeaderParameter,
        "OAuth2",
        ["write"],
        configuration
      );

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
    /**
     * チームで利用可能な絵文字を取得します。URIクエリ文字列を含めない場合、チーム固有の絵文字だけを取得します。
     * @summary 絵文字一覧を取得する
     * @param {string} teamName チーム名
     * @param {'all'} [include] &#x60;all&#x60;を指定すると、チーム固有の絵文字だけではなく、すべての絵文字を返します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getEmojis: async (
      teamName: string,
      include?: "all",
      options: any = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'teamName' is not null or undefined
      assertParamExists("getEmojis", "teamName", teamName);
      const localVarPath = `/teams/{team_name}/emojis`.replace(
        `{${"team_name"}}`,
        encodeURIComponent(String(teamName))
      );
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
        configuration
      );

      // authentication OAuth2 required
      // oauth required
      await setOAuthToObject(
        localVarHeaderParameter,
        "OAuth2",
        ["read"],
        configuration
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
 * EmojiApi - functional programming interface
 * @export
 */
export const EmojiApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = EmojiApiAxiosParamCreator(configuration);
  return {
    /**
     * 新しい絵文字を登録します。
     * @summary 絵文字を登録する
     * @param {string} teamName チーム名
     * @param {CreateEmojiBody} createEmojiBody
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async createEmoji(
      teamName: string,
      createEmojiBody: CreateEmojiBody,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<CreatedEmoji>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.createEmoji(
        teamName,
        createEmojiBody,
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
    /**
     * 登録したチーム固有の絵文字を削除します。
     * @summary 絵文字を削除する
     * @param {string} teamName チーム名
     * @param {string} code 絵文字コード
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async deleteEmoji(
      teamName: string,
      code: string,
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.deleteEmoji(
        teamName,
        code,
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
    /**
     * チームで利用可能な絵文字を取得します。URIクエリ文字列を含めない場合、チーム固有の絵文字だけを取得します。
     * @summary 絵文字一覧を取得する
     * @param {string} teamName チーム名
     * @param {'all'} [include] &#x60;all&#x60;を指定すると、チーム固有の絵文字だけではなく、すべての絵文字を返します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getEmojis(
      teamName: string,
      include?: "all",
      options?: any
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<EmojiList>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getEmojis(
        teamName,
        include,
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * EmojiApi - factory interface
 * @export
 */
export const EmojiApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = EmojiApiFp(configuration);
  return {
    /**
     * 新しい絵文字を登録します。
     * @summary 絵文字を登録する
     * @param {string} teamName チーム名
     * @param {CreateEmojiBody} createEmojiBody
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    createEmoji(
      teamName: string,
      createEmojiBody: CreateEmojiBody,
      options?: any
    ): AxiosPromise<CreatedEmoji> {
      return localVarFp
        .createEmoji(teamName, createEmojiBody, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * 登録したチーム固有の絵文字を削除します。
     * @summary 絵文字を削除する
     * @param {string} teamName チーム名
     * @param {string} code 絵文字コード
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    deleteEmoji(
      teamName: string,
      code: string,
      options?: any
    ): AxiosPromise<void> {
      return localVarFp
        .deleteEmoji(teamName, code, options)
        .then((request) => request(axios, basePath));
    },
    /**
     * チームで利用可能な絵文字を取得します。URIクエリ文字列を含めない場合、チーム固有の絵文字だけを取得します。
     * @summary 絵文字一覧を取得する
     * @param {string} teamName チーム名
     * @param {'all'} [include] &#x60;all&#x60;を指定すると、チーム固有の絵文字だけではなく、すべての絵文字を返します。
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getEmojis(
      teamName: string,
      include?: "all",
      options?: any
    ): AxiosPromise<EmojiList> {
      return localVarFp
        .getEmojis(teamName, include, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * Request parameters for createEmoji operation in EmojiApi.
 * @export
 * @interface EmojiApiCreateEmojiRequest
 */
export interface EmojiApiCreateEmojiRequest {
  /**
   * チーム名
   * @type {string}
   * @memberof EmojiApiCreateEmoji
   */
  readonly teamName: string;

  /**
   *
   * @type {CreateEmojiBody}
   * @memberof EmojiApiCreateEmoji
   */
  readonly createEmojiBody: CreateEmojiBody;
}

/**
 * Request parameters for deleteEmoji operation in EmojiApi.
 * @export
 * @interface EmojiApiDeleteEmojiRequest
 */
export interface EmojiApiDeleteEmojiRequest {
  /**
   * チーム名
   * @type {string}
   * @memberof EmojiApiDeleteEmoji
   */
  readonly teamName: string;

  /**
   * 絵文字コード
   * @type {string}
   * @memberof EmojiApiDeleteEmoji
   */
  readonly code: string;
}

/**
 * Request parameters for getEmojis operation in EmojiApi.
 * @export
 * @interface EmojiApiGetEmojisRequest
 */
export interface EmojiApiGetEmojisRequest {
  /**
   * チーム名
   * @type {string}
   * @memberof EmojiApiGetEmojis
   */
  readonly teamName: string;

  /**
   * &#x60;all&#x60;を指定すると、チーム固有の絵文字だけではなく、すべての絵文字を返します。
   * @type {'all'}
   * @memberof EmojiApiGetEmojis
   */
  readonly include?: "all";
}

/**
 * EmojiApi - object-oriented interface
 * @export
 * @class EmojiApi
 * @extends {BaseAPI}
 */
export class EmojiApi extends BaseAPI {
  /**
   * 新しい絵文字を登録します。
   * @summary 絵文字を登録する
   * @param {EmojiApiCreateEmojiRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof EmojiApi
   */
  public createEmoji(
    requestParameters: EmojiApiCreateEmojiRequest,
    options?: any
  ) {
    return EmojiApiFp(this.configuration)
      .createEmoji(
        requestParameters.teamName,
        requestParameters.createEmojiBody,
        options
      )
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * 登録したチーム固有の絵文字を削除します。
   * @summary 絵文字を削除する
   * @param {EmojiApiDeleteEmojiRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof EmojiApi
   */
  public deleteEmoji(
    requestParameters: EmojiApiDeleteEmojiRequest,
    options?: any
  ) {
    return EmojiApiFp(this.configuration)
      .deleteEmoji(requestParameters.teamName, requestParameters.code, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   * チームで利用可能な絵文字を取得します。URIクエリ文字列を含めない場合、チーム固有の絵文字だけを取得します。
   * @summary 絵文字一覧を取得する
   * @param {EmojiApiGetEmojisRequest} requestParameters Request parameters.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof EmojiApi
   */
  public getEmojis(requestParameters: EmojiApiGetEmojisRequest, options?: any) {
    return EmojiApiFp(this.configuration)
      .getEmojis(requestParameters.teamName, requestParameters.include, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
