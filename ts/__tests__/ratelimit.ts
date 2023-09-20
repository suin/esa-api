import MockAdapter from "axios-mock-adapter";
import { Client, createClient, PaginatedPosts } from "../index";
import { Ratelimit } from "../ratelimit";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("ratelimit object should be in AxiosResponse", async () => {
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts")
    .replyOnce<Partial<PaginatedPosts>>(
      200,
      {
        posts: [],
      },
      {
        "x-ratelimit-limit": "75",
        "x-ratelimit-remaining": "73",
        "x-ratelimit-reset": "1589974200",
      },
    );
  const { ratelimit } = await client.getPosts({ teamName: "acme" });
  expect(ratelimit).toMatchInlineSnapshot(`
    Ratelimit {
      "limit": 75,
      "remaining": 73,
      "reset": 1589974200,
    }
  `);
});

test("cooldown", async () => {
  const ratelimit = new Ratelimit({
    limit: 75,
    remaining: 0,
    reset: Date.now() + 3 * 1000, // resets in 3 seconds
  });
  const now = Date.now();
  await ratelimit.cooldown();
  const elapsedTime = Date.now() - now;
  expect(elapsedTime).toBeGreaterThanOrEqual(3000);
});
