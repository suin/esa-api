import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { isObject } from '@suin/is-object'

export const createClient = ({
  team,
  token,
}: {
  readonly team: string
  readonly token: string
}): Client => new Client({ team, token })

class Client {
  static readonly postsPerPageMax = 100

  readonly axios: AxiosInstance
  private readonly team: string

  /**
   * @internal
   */
  constructor({
    team,
    token,
  }: {
    readonly team: string
    readonly token: string
  }) {
    this.team = team
    this.axios = axios.create({ baseURL: 'https://api.esa.io/v1' })
    this.axios.interceptors.request.use(enheadAuthorization(token))
    this.axios.interceptors.response.use(setRatelimit, setRatelimit)
  }

  /**
   * 記事一覧を取得する
   */
  async getPosts({
    q,
    include: includeArray,
    sort,
    order,
    page,
    per_page,
  }: GetPostsParameters & PaginationParameters = {}): Promise<PostsPayload> {
    const include = includeArray ? includeArray.join(',') : undefined
    const response = await this.axios.request({
      method: 'GET',
      url: `/teams/${this.team}/posts`,
      params: { q, include, sort, order, page, per_page },
    })

    const { ratelimit } = response[esa]
    return { ...response.data, team: this.team, ratelimit }
  }

  /**
   * 指定された記事を取得する
   * @param postNumber 記事番号
   * @param params [[GetPostParameters]]参照
   */
  async getPost(
    postNumber: number,
    params?: GetPostParameters,
  ): Promise<PostPayload> {
    const include = params?.include?.join(',') ?? undefined
    try {
      const response = await this.axios.request({
        method: 'GET',
        url: `/teams/${this.team}/posts/${postNumber}`,
        params: { include },
      })
      const { ratelimit } = response[esa]
      return { post: response.data, team: this.team, ratelimit }
    } catch (e) {
      if (!isAxiosError(e) || e.response?.status !== 404) {
        throw e
      }
      const { ratelimit } = e.response[esa]
      return { team: this.team, ratelimit }
    }
  }

  /**
   * 指定された記事を編集します。
   */
  async updatePost(
    postNumber: number,
    post: UpdatePostParameters['post'],
  ): Promise<UpdatePostResult> {
    const data: UpdatePostParameters = { post }
    const response = await this.axios.request<UpdatePostResult['post']>({
      method: 'PATCH',
      url: `/teams/${this.team}/posts/${postNumber}`,
      data,
    })
    const { ratelimit } = response[esa]
    return { post: response.data, team: this.team, ratelimit }
  }
}

export type { Client }

/**
 * @internal
 */
const enheadAuthorization = (token: string) => (
  request: AxiosRequestConfig,
): AxiosRequestConfig => {
  request.headers.Authorization = `Bearer ${token}`
  return request
}

/**
 * @internal
 */
function setRatelimit(response: AxiosResponse): AxiosResponse
function setRatelimit<T>(error: T): Promise<T>
function setRatelimit<T>(
  responseOrError: AxiosResponse | T,
): AxiosResponse | Promise<T> {
  let response: AxiosResponse | undefined
  let returns: AxiosResponse | Promise<T>
  if ('headers' in responseOrError) {
    response = responseOrError
    returns = responseOrError
  } else {
    returns = Promise.reject(responseOrError)
    response =
      isAxiosError(responseOrError) && isObject(responseOrError.response)
        ? responseOrError.response
        : undefined
  }
  if (response === undefined) {
    return returns
  }
  response[esa] = response[esa] || {}
  const limit = parseInt(response.headers?.['x-ratelimit-limit'])
  const remaining = parseInt(response.headers?.['x-ratelimit-remaining'])
  const reset = parseInt(response.headers?.['x-ratelimit-reset'])
  if (
    Number.isInteger(limit) &&
    Number.isInteger(remaining) &&
    Number.isInteger(reset)
  ) {
    response[esa].ratelimit = {
      limit,
      remaining,
      reset: new Date(reset * 1000),
    }
  }
  return returns
}

export interface PostsPayload extends PaginatedData {
  posts: Post[]
  ratelimit: Ratelimit
  team: string
}

export interface PostPayload {
  /**
   * 記事データ
   *
   * 記事が存在しない場合`undefined`になる
   */
  post?: Post
  ratelimit: Ratelimit
  team: string
}

/**
 * 記事編集のパラメータ
 */
export interface UpdatePostParameters {
  post: {
    name?: string
    body_md?: string
    tags?: string[]
    category?: string
    wip?: boolean
    message?: string
    /**
     * チームメンバーのscreen_nameもしくは "esa_bot" を指定することで記事の 作成者 を上書きすることができます。
     * このパラメータは team の owner だけ が使用することができます。
     */
    created_by?: string | 'esa_bot'
    /**
     * チームメンバーのscreen_nameもしくは "esa_bot" を指定することで記事の 更新者 を上書きすることができます。
     * このパラメータは team の owner だけ が使用することができます。
     */
    updated_by?: string | 'esa_bot'
    /**
     * リクエストに正常な `post.body_md` パラメータと `post.original_revision.*` パラメータが存在する場合、記事更新時に3 way mergeが行われます。
     * `original_revision`パラメータが存在しない場合は、変更は常に後勝ちになります。
     * [ReleaseNotes/2014/12/23/記事保存時の自動マージ - docs.esa.io](https://docs.esa.io/posts/35)
     */
    original_revision?: {
      /**
       * 変更前の記事の本文です
       */
      body_md: string
      /**
       * 変更前の記事のrevision_numberを指定します
       */
      number: number
      /**
       * 変更前の記事の最終更新者のscreen_nameを指定します
       */
      user: string
    }
  }
}

/**
 * 記事編集結果
 *
 * PATCH /v1/teams/:team_name/posts/:post_numberのレスポンス。
 */
export interface UpdatePostResult {
  post: Post & {
    /**
     * 3 way mergeを行いコンフリクトが起きた場合にのみ `true` になります。
     */
    overlapped: boolean
  }
  ratelimit: Ratelimit
  team: string
}

export interface PaginatedData {
  prev_page: null | number
  next_page: null | number
  total_count: number
  page: number
  per_page: number
  max_per_page: number
}

export interface Post {
  number: number
  name: string
  full_name: string
  wip: boolean
  body_md: string
  body_html: string
  created_at: string
  message: string
  kind: string
  comments_count: number
  tasks_count: number
  done_tasks_count: number
  url: string
  updated_at: string
  tags: string[]
  category: null | string
  revision_number: number
  created_by: User
  updated_by: User
  stargazers_count: number
  watchers_count: number
  star: boolean
  watch: boolean
  sharing_urls: null | {
    html: string
    slides: string
  }
  comments?: Comment[]
  stargazers?: Stargazer[]
}

export interface Comment {
  id: number
  body_md: string
  body_html: string
  created_at: string
  updated_at: string
  post_number: number
  url: string
  created_by: User
  stargazers_count: number
  star: boolean
  stargazers?: Stargazer[]
}

export interface Stargazer {
  created_at: string
  body: null | string
  user: User
}

export interface User {
  name: string
  screen_name: string
  icon: string
}

/**
 * GET /v1/teams/:team_name/postsに指定できるURIクエリ文字列
 *
 * 公式ドキュメント: [dev/esa/api/v1 #noexpand -
 * docs.esa.io](https://docs.esa.io/posts/102#URI%E3%82%AF%E3%82%A8%E3%83%AA%E6%96%87%E5%AD%97%E5%88%97-1)
 */
export interface GetPostsParameters {
  /**
   * 記事を絞り込むための条件を指定します
   *
   * [help/記事の検索方法 - docs.esa.io](https://docs.esa.io/posts/104)を参照
   */
  readonly q?: string

  /**
   * 記事の関連情報を含めることができます。
   *
   * - `comments` を指定するとコメントの配列を含んだレスポンスを返します。
   * - `stargazers` を指定するとStarの配列を含んだレスポンスを返します。
   * - 複数指定できます。
   */
  readonly include?: ReadonlyArray<
    'comments' | 'comments.stargazers' | 'stargazers'
  >

  /**
   * 記事の並び順
   *
   * - `updated` (default): 記事の更新日時
   * - `created`: 記事の作成日時
   * - `number`: 記事番号
   * - `stars`: 記事へのStarの数
   * - `watches`: 記事へのWatchの数
   * - `comments`: 記事へのCommentの数
   * - `best_match`: 総合的な記事のスコア
   */
  readonly sort?:
    | 'updated'
    | 'created'
    | 'number'
    | 'stars'
    | 'watches'
    | 'comments'
    | 'best_match'

  /**
   * 並び順の方向
   *
   * - `desc` (default): 降順
   * - `asc`: 昇順
   */
  readonly order?: 'desc' | 'asc'
}

/**
 * GET /v1/teams/:team_name/posts/:post_numberに指定できるURIクエリ文字列
 *
 * 公式ドキュメント: [dev/esa/api/v1 #noexpand -
 * docs.esa.io](https://docs.esa.io/posts/102#URI%E3%82%AF%E3%82%A8%E3%83%AA%E6%96%87%E5%AD%97%E5%88%97-2)
 */
export interface GetPostParameters {
  /**
   * 記事の関連情報を含めることができます。
   *
   * - `comments` を指定するとコメントの配列を含んだレスポンスを返します。
   * - `comments,comments.stargazers`を指定するとコメントとコメントに対するStarの配列を含んだレスポンスを返します。
   * - `stargazers` を指定するとStarの配列を含んだレスポンスを返します。
   * - 複数指定できます。
   */
  readonly include?: ReadonlyArray<
    'comments' | 'comments.stargazers' | 'stargazers'
  >
}

export interface PaginationParameters {
  readonly page?: number
  readonly per_page?: number
}

export interface Ratelimit {
  limit: number
  remaining: number
  reset: Date
}

/**
 * @internal
 */
const esa = Symbol('esa')

/**
 * @internal
 */
declare module 'axios' {
  export interface AxiosResponse<T = any> {
    [esa]: {
      ratelimit: Ratelimit
    }
  }
}

const isAxiosError = (error: unknown): error is AxiosError =>
  isObject<AxiosError>(error) && error.isAxiosError === true
