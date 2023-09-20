import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  Configuration,
  EsaApi,
  EsaApiCreatePostRequest,
  EsaApiGetPostRequest,
  EsaApiGetPostsRequest,
  EsaApiUpdatePostRequest,
  NewPost,
  PaginatedPosts,
  Post,
} from "./client";
import { setRatelimit } from "./ratelimit";

export type { Client };
export * from "./client";
export function createClient({ token }: { readonly token: string }): Client {
  return new Client({ token });
}

class Client extends EsaApi {
  constructor({ token }: { readonly token: string }) {
    const axiosInstance = axios.create();
    axiosInstance.interceptors.response.use(setRatelimit, setRatelimit);
    super(new Configuration({ accessToken: token }), undefined, axiosInstance);
  }

  get axiosInstance(): AxiosInstance {
    return this.axios;
  }

  getPosts(
    requestParameters: EsaApiGetPostsRequest,
    options?: any,
  ): Promise<AxiosResponse<PaginatedPosts>> {
    return super.getPosts(requestParameters, options).then((res) => {
      if (res.status === 200) {
        for (const posts of res.data.posts) {
          posts.name = decodeSharpsAndSlashes(posts.name);
        }
      }
      return res;
    });
  }

  getPost(
    requestParameters: EsaApiGetPostRequest,
    options?: any,
  ): Promise<AxiosResponse<Post>> {
    return super.getPost(requestParameters, options).then(decodeName);
  }

  createPost(
    requestParameters: {
      readonly teamName: string;
      readonly post: NewPost;
    },
    options?: any,
  ): Promise<AxiosResponse<Post>>;
  createPost(
    requestParameters: EsaApiCreatePostRequest,
    options?: any,
  ): Promise<AxiosResponse<Post>>;
  createPost(
    requestParameters:
      | EsaApiCreatePostRequest
      | {
          readonly teamName: string;
          readonly post: NewPost;
        },
    options?: any,
  ): Promise<AxiosResponse<Post>> {
    const param: EsaApiCreatePostRequest =
      "post" in requestParameters
        ? {
            teamName: requestParameters.teamName,
            createPostBody: { post: requestParameters.post },
          }
        : requestParameters;
    param.createPostBody.post.name = encodeSharpsAndSlashes(
      param.createPostBody.post.name,
    );
    return super.createPost(param, options).then(decodeName);
  }

  updatePost(
    requestParameters: EsaApiUpdatePostRequest,
    options?: any,
  ): Promise<AxiosResponse<Post>> {
    if (requestParameters.updatePostBody.post.name) {
      requestParameters.updatePostBody.post.name = encodeSharpsAndSlashes(
        requestParameters.updatePostBody.post.name,
      );
    }
    return super.updatePost(requestParameters, options).then(decodeName);
  }
}

function decodeSharpsAndSlashes(name: string): string {
  return name.replace(/&#35;/g, "#").replace(/&#47;/g, "/");
}

function encodeSharpsAndSlashes(name: string): string {
  return name.replace(/#/g, "&#35;").replace(/\//g, "&#47;");
}

function decodeName(res: AxiosResponse<Post>): AxiosResponse<Post> {
  if (res.status < 200 || res.status >= 300) {
    return res;
  }

  if (typeof (res.data.name as unknown) === "string") {
    res.data.name = decodeSharpsAndSlashes(res.data.name);
  }

  return res;
}
