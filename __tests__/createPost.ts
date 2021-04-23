import MockAdapter from "axios-mock-adapter";
import { Client, createClient, CreatePostBody, Post } from "../index";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("create a post", async () => {
  const createPostBody: CreatePostBody = { post: { name: "title" } };
  const createdPost: Partial<Post> = {
    number: 1,
    name: "title",
  };
  mock
    .onPost("https://api.esa.io/v1/teams/acme/posts", createPostBody)
    .replyOnce(201, createdPost, {});
  const { data } = await client.createPost({
    teamName: "acme",
    createPostBody,
  });
  expect(data).toEqual(createdPost);
});

test("create a post with full params", async () => {
  const createPostBody: CreatePostBody = {
    post: {
      name: "new name",
      tags: ["tag1"],
      wip: true,
      body_md: "body",
      category: "category name",
      message: "message",
      user: "esa_bot",
      template_post_id: 123,
    },
  };
  const createdPost: Partial<Post> = {
    wip: true,
    name: "title",
  };
  mock
    .onPost("https://api.esa.io/v1/teams/acme/posts", createPostBody)
    .replyOnce(201, createdPost, {});
  const { data } = await client.createPost({
    teamName: "acme",
    createPostBody,
  });
  expect(data).toEqual(createdPost);
});

test("リクエスト中のpost.nameのスラッシュは&#47;にエスケープされること", async () => {
  const expectedRequestBody: CreatePostBody = { post: { name: "foo&#47;bar" } };
  mock
    .onPost("https://api.esa.io/v1/teams/acme/posts", expectedRequestBody)
    .replyOnce<Partial<Post>>(201, { name: "" }, {});
  await client.createPost({
    teamName: "acme",
    post: { name: "foo/bar" },
  });
});

test("レスポンスのnameの&#47;はスラッシュにデコードされること", async () => {
  const createdPost: Partial<Post> = { name: "foo&#47;bar" };
  mock
    .onPost("https://api.esa.io/v1/teams/acme/posts")
    .replyOnce(201, createdPost, {});
  const { data } = await client.createPost({
    teamName: "acme",
    post: { name: "foo/bar" } as any,
  });
  expect(data.name).toBe("foo/bar");
});

test("リクエスト中のpost.nameの#は&#35;にエスケープされること", async () => {
  const expectedRequestBody: CreatePostBody = { post: { name: "&#35;" } };
  mock
    .onPost("https://api.esa.io/v1/teams/acme/posts", expectedRequestBody)
    .replyOnce<Partial<Post>>(201, { name: "" }, {});
  await client.createPost({
    teamName: "acme",
    post: { name: "#" },
  });
});

test("レスポンスのnameの&#35;は#にデコードされること", async () => {
  const createdPost: Partial<Post> = { name: "&#35;" };
  mock
    .onPost("https://api.esa.io/v1/teams/acme/posts")
    .replyOnce(201, createdPost, {});
  const { data } = await client.createPost({
    teamName: "acme",
    post: { name: "" } as any,
  });
  expect(data.name).toBe("#");
});
