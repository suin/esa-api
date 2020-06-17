import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

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
    this.axios.interceptors.response.use(embodyRatelimit)
    this.axios.interceptors.response.use(embodyTeamName(team))
  }

  /**
   * 投稿リストを取得する
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
    const { data } = await this.axios.request({
      method: 'GET',
      url: `/teams/${this.team}/posts`,
      params: { q, include, sort, order, page, per_page },
    })
    return data
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
const embodyRatelimit = (response: AxiosResponse): AxiosResponse => {
  const limit = parseInt(response.headers['x-ratelimit-limit'])
  const remaining = parseInt(response.headers['x-ratelimit-remaining'])
  const reset = parseInt(response.headers['x-ratelimit-reset'])
  if (
    Number.isInteger(limit) &&
    Number.isInteger(remaining) &&
    Number.isInteger(reset)
  ) {
    response.data.ratelimit = {
      limit,
      remaining,
      reset: new Date(reset * 1000),
    }
  }
  return response
}

/**
 * @internal
 */
const embodyTeamName = (team: string) => (
  response: AxiosResponse,
): AxiosResponse => {
  response.data.team = team
  return response
}

export interface PostsPayload extends PaginatedData {
  posts: Post[]
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
 * 公式ドキュメント: [dev/esa/api/v1 #noexpand - docs.esa.io](https://docs.esa.io/posts/102#URI%E3%82%AF%E3%82%A8%E3%83%AA%E6%96%87%E5%AD%97%E5%88%97-1)
 */
export interface GetPostsParameters {
  /**
   * 記事を絞り込むための条件を指定します
   *
   * [help/記事の検索方法 - docs.esa.io](https://docs.esa.io/posts/104)を参照
   */
  readonly q?: string

  /**
   * 投稿の関連情報を含めることができます。
   *
   * - `comments` を指定するとコメントの配列を含んだレスポンスを返します。
   * - `stargazers` を指定するとStarの配列を含んだレスポンスを返します。
   * - 複数指定できます。
   */
  readonly include?: ReadonlyArray<
    'comments' | 'comments.stargazers' | 'stargazers'
  >

  /**
   * 投稿の並び順
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

export interface PaginationParameters {
  readonly page?: number
  readonly per_page?: number
}

export interface Ratelimit {
  limit: number
  remaining: number
  reset: Date
}
