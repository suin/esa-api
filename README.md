# @suin/esa-api

esa.io API のクライアントライブラリ。

## 特徴

- 現在、投稿リストの取得のみに対応しています。

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
// 投稿一覧を取得する
const { posts } = await client.getPosts()
```

複雑なクエリの例:

```typescript
import { createClient } from '@suin/esa-api'
const client = createClient({
  team: 'foo',
  token: process.env.ESA_TOKEN,
})

// 細かい条件を設定して投稿一覧を取得する
const result = await client.getPosts({
  q: 'wip:false',
  include: ['comments', 'comments.stargazers', 'stargazers'],
  sort: 'updated',
  order: 'desc',
  per_page: 100,
  page: 1,
})

// 結果からは様々な付随情報が得られます:
// 1. 投稿リスト
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
