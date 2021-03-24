import { PaginatedData } from './index'
import { AxiosInstance } from 'axios'

/**
 * メンバー一覧を取得する
 */
export async function getMembers(
  axios: AxiosInstance,
  team: string,
  { sort, order }: GetMembersParameters,
): Promise<MembersPayload> {
  const response = await axios.request<MembersPayload>({
    method: 'GET',
    url: `/teams/${team}/members`,
    params: { sort, order },
  })
  return { ...response.data, team }
}

/**
 * GET /v1/teams/:team_name/membersに指定できるURIクエリ文字列
 *
 * 公式ドキュメント: [dev/esa/api/v1 #noexpand -
 * docs.esa.io](https://docs.esa.io/posts/102#GET%20/v1/teams/:team_name/members)
 */
export interface GetMembersParameters {
  /**
   * メンバーの並び順
   *
   * - `posts_count` (default): チーム内での記事の作成数
   * - `joined`: チームへ参加日時
   * - `last_accessed`: 最終アクセス日時
   */
  readonly sort?: 'posts_count' | 'joined' | 'last_accessed'

  /**
   * 並び順の方向
   *
   * - `desc` (default): 降順
   * - `asc`: 昇順
   */
  readonly order?: 'desc' | 'asc'
}

/**
 * GET /v1/teams/:team_name/membersのレスポンスボディ
 */
export interface MembersPayload extends PaginatedData {
  members: Member[]
  team: string
}

/**
 * チームのメンバーを表します。
 */
export interface Member {
  /**
   * 自分自身であるかどうかのフラグです。
   */
  myself: boolean
  /**
   * メンバーの名前です
   */
  name: string
  /**
   * メンバーのスクリーンネームです
   */
  screen_name: string
  /**
   * メンバーのアイコンのURLです
   */
  icon: string
  /**
   * メンバーのemailです
   *
   * このフィールドは team の owner だけが取得可能です。
   *
   * ownerでない場合、このキーは存在しません。
   */
  email?: string
  /**
   * メンバーのロール(owner, member)です。
   */
  role: 'owner' | 'member'
  /**
   * チーム内でメンバーが作成した記事数です
   */
  posts_count: number
  /**
   * チームにメンバーが参加した日時です
   */
  joined_at: string
  /**
   * チームにメンバーがアクセスした最後の日時です
   *
   * 参考: [help/details/メンバーの最終アクセス日時について](https://docs.esa.io/posts/364)
   */
  last_accessed_at: string
}
