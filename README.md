# @suin/esa-api

esa.io API のクライアントライブラリ。

## 特徴

- 現在、以下のエンドポイントにのみに対応しています。
  - GET /v1/teams/:team_name/members (メンバー一覧の取得)
  - GET /v1/teams/:team_name/posts (記事一覧の取得)
  - GET /v1/teams/:team_name/posts/:post_number (指定された記事の取得)
  - POST /v1/teams/:team_name/posts (記事の新規投稿)
  - PATCH /v1/teams/:team_name/posts/:post_number (指定された記事の編集)

## インストール

```bash
yarn add @suin/esa-api
# or
npm install @suin/esa-api
```

## 使い方

基本的な用法:

```typescript
import { createClient } from '@suin/esa-api'
const client = createClient({
  team: 'foo', // チーム名
  token: process.env.ESA_TOKEN, // アクセストーン
})
{
  // 記事一覧を取得する
  const { posts } = await client.getPosts()
}
{
  // 指定した記事を取得する
  const { post } = await client.getPost(1)
}
{
  // 記事を新規投稿する
  const { post } = await client.createPost({
    name: 'hi!',
    body_md: '# Getting Started\n',
    tags: ['api', 'dev'],
    category: 'dev/2015/05/10',
    wip: false,
    message: 'Add Getting Started section',
  })
}
{
  // 指定した記事を編集する
  const { post } = await client.updatePost(1, {
    wip: false,
    message: 'Ship it!',
  })
}
```

複雑なクエリの例:

```typescript
import { createClient } from '@suin/esa-api'
const client = createClient({
  team: 'foo',
  token: process.env.ESA_TOKEN,
})

// 細かい条件を設定して記事一覧を取得する
const result = await client.getPosts({
  q: 'wip:false',
  include: ['comments', 'comments.stargazers', 'stargazers'],
  sort: 'updated',
  order: 'desc',
  per_page: 100,
  page: 1,
})

// 結果からは様々な付随情報が得られます:
// 1. 記事一覧
const { posts } = result
// 2. チーム名
const { team } = result
// 3. 利用制限
const { limit, remaining, reset } = result.ratelimit
// 4. ページネーション
const {
  prev_page,
  next_page,
  page,
  per_page,
  max_per_page,
  total_count,
} = result
```

## API リファレンス

https://suin.github.io/esa-api/
