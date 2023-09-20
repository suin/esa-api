import MockAdapter from "axios-mock-adapter";
import { Client, createClient, Post, PaginatedPosts } from "../index";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("pagination", async () => {
  const post1 = { number: 1, name: "" } as Post;
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts?per_page=1")
    .replyOnce<Partial<PaginatedPosts>>(
      200,
      {
        posts: [post1],
        next_page: 2,
      },
      {},
    );

  const { data: data1 } = await client.getPosts({
    teamName: "acme",
    perPage: 1,
  });
  expect(data1.posts[0]).toEqual(post1);

  const post2 = { number: 2, name: "" } as Post;
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts?page=2&per_page=1")
    .replyOnce<Partial<PaginatedPosts>>(
      200,
      {
        posts: [post2],
        next_page: 3,
      },
      {},
    );

  const { data: data2 } = await client.getPosts({
    teamName: "acme",
    perPage: 1,
    page: data1.next_page!,
  });
  expect(data2.posts[0]).toEqual(post2);
});
