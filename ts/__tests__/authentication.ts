import MockAdapter from "axios-mock-adapter";
import { Client, createClient } from "../index";

let client: Client;
let mock: MockAdapter;

beforeEach(async () => {
  client = await createClient({ token: "mock-token" });
  mock = new MockAdapter(client.axiosInstance, { onNoMatch: "throwException" });
});

test("token", async () => {
  mock
    .onGet("https://api.esa.io/v1/teams/acme/posts/1")
    .replyOnce(({ headers }) => {
      expect(headers).toMatchObject({ Authorization: "Bearer mock-token" });
      return [404];
    });

  await expect(
    client.getPost({ teamName: "acme", postNumber: 1 }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Request failed with status code 404"`,
  );
});
