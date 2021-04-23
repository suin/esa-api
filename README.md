# @suin/esa-api

esa.io API のクライアントライブラリ。

## 特徴

- すべてのエンドポイントに対応しています。
- [esa API の OpenAPI 仕様書](https://github.com/suin/esa-openapi)から生成したクライアントライブラリをベースに一部拡張を加えたライブラリです。

## インストール

```bash
yarn add @suin/esa-api
# or
npm install @suin/esa-api
```

## 使い方

基本的な用法:

```typescript
import { createClient } from "@suin/esa-api";

const teamName = "your_team_name";

const client = createClient({
  token: process.env.ESA_TOKEN, // アクセストーン
});

{
  // 記事一覧を取得する
  const {
    data: { posts },
  } = await client.getPosts({ teamName });
}

{
  // 指定した記事を取得する
  const { data: post } = await client.getPost({ teamName, postNumber: 1 });
}

{
  // 記事を新規投稿する
  const { data: createdPost } = await client.createPost({
    teamName,
    post: {
      name: "hi!",
      body_md: "# Getting Started\n",
      tags: ["api", "dev"],
      category: "dev/2015/05/10",
      wip: false,
      message: "Add Getting Started section",
    },
  });
}

{
  // 指定した記事を編集する
  const { data: updatedPost } = await client.updatePost({
    teamName,
    postNumber: 1,
    updatePostBody: {
      post: {
        wip: false,
        message: "Ship it!",
      },
    },
  });
}
```

複雑なクエリの例:

```typescript
import { createClient } from "@suin/esa-api";

const teamName = "your_team_name";

const client = createClient({
  token: process.env.ESA_TOKEN,
});

// 細かい条件を設定して記事一覧を取得する
const response = await client.getPosts({
  teamName,
  q: "wip:false",
  include: ["comments", "comments.stargazers", "stargazers"],
  sort: "updated",
  order: "desc",
  per_page: 100,
  page: 1,
});

// 結果からは様々な付随情報が得られます:
// 1. 記事一覧
const { posts } = response.data;
// 2. 利用制限
const { limit, remaining, reset } = response.ratelimit;
// 3. ページネーション
const {
  prev_page,
  next_page,
  page,
  per_page,
  max_per_page,
  total_count,
} = response.data;
```

## API リファレンス

https://suin.github.io/esa-api/
