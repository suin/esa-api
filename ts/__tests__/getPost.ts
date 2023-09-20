import MockAdapter from "axios-mock-adapter";
import { Client, createClient, Post } from "../index";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("記事のnameのシャープとスラッシュはデコードされること", async () => {
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts/1")
    .replyOnce<Partial<Post>>(
      200,
      {
        name: "sharps are &#35;&#35;&#35; and slashes are &#47;&#47;&#47;",
      },
      {},
    );
  const { data } = await client.getPost({ teamName: "acme", postNumber: 1 });
  expect(data.name).toBe("sharps are ### and slashes are ///");
});
