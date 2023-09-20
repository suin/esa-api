import MockAdapter from "axios-mock-adapter";
import { Client, createClient, PaginatedPosts, Post } from "../index";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("request parameters", async () => {
  mock
    .onGet(
      "https://api.esa.io/v1/teams/acme/posts?q=text&include=comments%2Cstargazers&sort=stars&order=desc&page=2&per_page=100",
    )
    .replyOnce(() => {
      return [200, { posts: [] }, {}];
    });
  await client.getPosts({
    teamName: "acme",
    q: "text",
    include: ["comments", "stargazers"],
    sort: "stars",
    order: "desc",
    page: 2,
    perPage: 100,
  });
});

test("get 2 posts", async () => {
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts?per_page=2")
    .replyOnce<Partial<PaginatedPosts>>(
      200,
      {
        posts: [{ name: "" }, { name: "" }] as Post[],
      },
      {},
    );
  const { data } = await client.getPosts({
    teamName: "acme",
    perPage: 2,
  });
  expect(data.posts.length).toBe(2);
});

test("記事のnameのシャープとスラッシュはデコードされること", async () => {
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts?page=1")
    .replyOnce<Partial<PaginatedPosts>>(
      200,
      {
        posts: [
          {
            name: "sharps are &#35;&#35;&#35; and slashes are &#47;&#47;&#47;",
          } as Post,
        ],
      },
      {},
    );
  const { data } = await client.getPosts({ teamName: "acme", page: 1 });
  expect(data.posts[0].name).toBe("sharps are ### and slashes are ///");
});
