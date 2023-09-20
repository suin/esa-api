import MockAdapter from "axios-mock-adapter";
import { Client, createClient, Post, UpdatePostBody } from "../index";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("update a post", async () => {
  const updatePostBody: UpdatePostBody = {
    post: {
      name: "new name",
    },
  };
  const updatedPost: Partial<Post> = {
    number: 1,
    name: "new name",
  };
  mock
    .onPatch("https://api.esa.io/v1/teams/acme/posts/1", updatePostBody)
    .replyOnce(200, updatedPost, {});
  const { data } = await client.updatePost({
    teamName: "acme",
    postNumber: 1,
    updatePostBody,
  });
  expect(data).toEqual(updatedPost);
});

test("リクエスト中のpost.nameのスラッシュは&#47;にエスケープされること", async () => {
  const updatePostBody: UpdatePostBody = { post: { name: "foo&#47;bar" } };
  mock
    .onPatch("https://api.esa.io/v1/teams/acme/posts/1", updatePostBody)
    .replyOnce<Partial<Post>>(200, { name: "" }, {});
  await client.updatePost({
    teamName: "acme",
    postNumber: 1,
    updatePostBody: {
      post: { name: "foo/bar" },
    },
  });
});

test("レスポンスのnameの&#47;はスラッシュにデコードされること", async () => {
  const updatedPost: Partial<Post> = { name: "foo&#47;bar" };
  mock
    .onPatch("https://api.esa.io/v1/teams/acme/posts/1")
    .replyOnce(200, updatedPost, {});
  const { data } = await client.updatePost({
    teamName: "acme",
    postNumber: 1,
    updatePostBody: {
      post: { name: "foo/bar" } as any,
    },
  });
  expect(data.name).toBe("foo/bar");
});

test("リクエスト中のpost.nameの#は&#35;にエスケープされること", async () => {
  const expectedRequestBody: UpdatePostBody = { post: { name: "&#35;" } };
  mock
    .onPatch("https://api.esa.io/v1/teams/acme/posts/1", expectedRequestBody)
    .replyOnce<Partial<Post>>(200, { name: "" }, {});
  await client.updatePost({
    teamName: "acme",
    postNumber: 1,
    updatePostBody: {
      post: { name: "#" },
    },
  });
});

test("レスポンスのnameの&#35;は#にデコードされること", async () => {
  const updatedPost: Partial<Post> = { name: "&#35;" };
  mock
    .onPatch("https://api.esa.io/v1/teams/acme/posts/1")
    .replyOnce(200, updatedPost, {});
  const { data } = await client.updatePost({
    teamName: "acme",
    postNumber: 1,
    updatePostBody: {
      post: { name: "" },
    },
  });
  expect(data.name).toBe("#");
});
