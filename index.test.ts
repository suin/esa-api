import MockAdapter from 'axios-mock-adapter'
import {
  Client,
  createClient,
  CreatePostParameters,
  CreatePostResult,
  Post,
  PostsPayload,
  UpdatePostParameters,
  UpdatePostResult,
} from './index'

describe('esaApi', () => {
  let client: Client
  let mock: MockAdapter

  beforeEach(() => {
    client = createClient({
      team: 'acme',
      token: 'mock-token',
    })
    mock = new MockAdapter(client.axios)
  })

  describe('integration testing', () => {
    const { ESA_TEAM: team, ESA_TOKEN: token } = process.env as any
    if (typeof team !== 'string' || typeof token !== 'string') {
      console.warn(
        'skipped integration testing since `ESA_TEAM` and `ESA_TOKEN` was not provided',
      )
      return
    }
    beforeEach(() => {
      client = createClient({ team, token })
    })

    test('get one post', async () => {
      const { posts } = await client.getPosts({ per_page: 1 })
      expect(posts.length).toBe(1)
    })

    test('get a post by number', async () => {
      const { post } = await client.getPost(1)
      expect(post!.number).toBe(1)
    })

    describe('createPost', () => {
      test('create a post', async () => {
        const { post } = await client.createPost({
          name: 'New Post',
          body_md: 'New Post Body',
          category: 'esa-api-test',
        })
        expect(post.name).toBe('New Post')
      })
    })

    describe('updatePost', () => {
      test('update a post', async () => {
        const { posts } = await client.getPosts({ q: 'tag:esa-api-test-data' })
        if (posts.length !== 1) {
          console.warn('the post for test not found')
          return
        }
        const { number, revision_number } = posts[0]
        const { post } = await client.updatePost(number, {
          wip: true,
          body_md:
            '`@suin/esa-api`からのテストです。この投稿は消さないでください。',
          message: 'updated by test code',
        })
        expect(post.revision_number).toBe(revision_number + 1)
      })
    })
  })

  describe('enhead authorization', () => {
    test('token', async () => {
      mock.onGet('/teams/acme/posts/1').replyOnce(({ headers }) => {
        expect(headers).toMatchObject({ Authorization: 'Bearer mock-token' })
        return [404]
      })
      await client.getPost(1)
    })
  })

  describe('getPosts', () => {
    test('request parameters', async () => {
      mock.onGet('/teams/acme/posts').replyOnce(({ params }) => {
        expect(params).toEqual({
          q: 'text',
          include: 'comments,stargazers',
          sort: 'stars',
          order: 'desc',
          page: 2,
          per_page: 100,
        })
        return [200, { posts: [] }, {}]
      })
      await client.getPosts({
        q: 'text',
        include: ['comments', 'stargazers'],
        sort: 'stars',
        order: 'desc',
        page: 2,
        per_page: 100,
      })
    })

    test('get 2 posts', async () => {
      mock.onGet('/teams/acme/posts').replyOnce<Partial<PostsPayload>>(
        200,
        {
          posts: [{ name: '' }, { name: '' }] as Post[],
          next_page: 2,
        },
        {},
      )
      const data = await client.getPosts({ per_page: 2 })
      expect(data.posts.length).toBe(2)
    })

    test('pagination', async () => {
      const post1 = { number: 1, name: '' } as Post
      mock.onGet('/teams/acme/posts').replyOnce<Partial<PostsPayload>>(
        200,
        {
          posts: [post1] as Post[],
          next_page: 2,
        },
        {},
      )

      const data1 = await client.getPosts({ per_page: 1 })
      expect(data1.posts[0]).toEqual(post1)

      const post2 = { number: 2, name: '' } as Post
      mock.onGet('/teams/acme/posts').replyOnce<Partial<PostsPayload>>(
        200,
        {
          posts: [post2] as Post[],
          next_page: 3,
        },
        {},
      )

      const data2 = await client.getPosts({
        per_page: 1,
        page: data1.next_page!,
      })
      expect(data2.posts[0]).toEqual(post2)
    })

    test('ratelimit', async () => {
      mock.onGet('/teams/acme/posts').replyOnce<Partial<PostsPayload>>(
        200,
        {
          posts: [],
        },
        {
          'x-ratelimit-limit': '75',
          'x-ratelimit-remaining': '73',
          'x-ratelimit-reset': '1589974200',
        },
      )
      const { ratelimit } = await client.getPosts()
      expect(ratelimit).toEqual({
        limit: 75,
        remaining: 73,
        reset: new Date(1589974200 * 1000),
      })
    })

    test('escape sharps and slashes', async () => {
      mock.onGet('/teams/acme/posts').replyOnce<Partial<PostsPayload>>(
        200,
        {
          posts: [
            {
              name:
                'sharps are &#35;&#35;&#35; and slashes are &#47;&#47;&#47;',
            },
          ] as Post[],
        },
        {},
      )
      const data = await client.getPosts()
      expect(data.posts[0].name).toBe('sharps are ### and slashes are ///')
    })
  })

  describe('getPost', () => {
    test('get a specific post', async () => {
      mock
        .onGet('/teams/acme/posts/1')
        .replyOnce<Partial<Post>>(200, { number: 1, name: '' }, {})
      const data = await client.getPost(1)
      expect(data.post!.number).toBe(1)
    })

    test('get a specific post with comments', async () => {
      mock
        .onGet('/teams/acme/posts/1', { params: { include: 'comments' } })
        .replyOnce<Partial<Post>>(200, { number: 1, name: '' }, {})
      const data = await client.getPost(1, { include: ['comments'] })
      expect(data.post!.number).toBe(1)
    })

    test('get a specific post with comments and stargazers', async () => {
      mock
        .onGet('/teams/acme/posts/1', {
          params: { include: 'comments,stargazers' },
        })
        .replyOnce<Partial<Post>>(200, { number: 1, name: '' }, {})
      const data = await client.getPost(1, {
        include: ['comments', 'stargazers'],
      })
      expect(data.post!.number).toBe(1)
    })

    test('not found', async () => {
      mock.onGet('/teams/acme/posts/1').replyOnce(404, {
        error: 'not_found',
        message: 'Not Found',
      })
      const data = await client.getPost(1)
      expect(data.post).toBe(undefined)
    })

    test('ratelimit', async () => {
      mock.onGet('/teams/acme/posts/1').replyOnce<Partial<Post>>(
        200,
        { number: 1, name: '' },
        {
          'x-ratelimit-limit': '75',
          'x-ratelimit-remaining': '73',
          'x-ratelimit-reset': '1589974200',
        },
      )
      const { ratelimit } = await client.getPost(1)
      expect(ratelimit).toEqual({
        limit: 75,
        remaining: 73,
        reset: new Date(1589974200 * 1000),
      })
    })

    test('ratelimit and not found', async () => {
      mock.onGet('/teams/acme/posts/1').replyOnce(
        404,
        {
          error: 'not_found',
          message: 'Not Found',
        },
        {
          'x-ratelimit-limit': '75',
          'x-ratelimit-remaining': '73',
          'x-ratelimit-reset': '1589974200',
        },
      )
      const { ratelimit } = await client.getPost(1)
      expect(ratelimit).toEqual({
        limit: 75,
        remaining: 73,
        reset: new Date(1589974200 * 1000),
      })
    })

    test('escape sharps and slashes', async () => {
      mock.onGet('/teams/acme/posts/1').replyOnce<Partial<Post>>(
        200,
        {
          name: 'sharps are &#35;&#35;&#35; and slashes are &#47;&#47;&#47;',
        },
        {},
      )
      const data = await client.getPost(1)
      expect(data.post!.name).toBe('sharps are ### and slashes are ///')
    })
  })

  describe('createPost', () => {
    test('create a post', async () => {
      const reqBody: CreatePostParameters = { post: { name: 'title' } }
      const resBody: Partial<CreatePostResult['post']> = {
        number: 1,
        name: 'title',
      }
      mock.onPost('/teams/acme/posts', reqBody).replyOnce(200, resBody, {})
      const data = await client.createPost({ name: 'title' })
      expect(data.post.number).toBe(1)
    })

    test('create a post with full params', async () => {
      const post: Required<CreatePostParameters['post']> = {
        name: 'new name',
        tags: ['tag1'],
        wip: true,
        body_md: 'body',
        category: 'category name',
        message: 'message',
        user: 'esa_bot',
        template_post_id: 123,
      }
      const reqBody: CreatePostParameters = { post }
      const resBody: Partial<CreatePostResult['post']> = {
        wip: true,
        name: 'title',
      }
      mock.onPost('/teams/acme/posts', reqBody).replyOnce(200, resBody, {})
      const data = await client.createPost(post)
      expect(data.post.wip).toBe(true)
    })

    test('slash in name is replaced with &#47;', async () => {
      const reqBody: CreatePostParameters = { post: { name: 'foo&#47;bar' } }
      const resBody: Partial<CreatePostResult['post']> = { name: 'foo&#47;bar' }
      mock.onPost('/teams/acme/posts', reqBody).replyOnce(200, resBody, {})
      const data = await client.createPost({ name: 'foo/bar' })
      expect(data.post.name).toBe('foo/bar')
    })

    test('sharp in name is replaced with &#35;', async () => {
      const reqBody: CreatePostParameters = { post: { name: 'sharp is &#35;' } }
      const resBody: Partial<CreatePostResult['post']> = {
        name: 'sharp is &#35;',
      }
      mock.onPost('/teams/acme/posts', reqBody).replyOnce(200, resBody, {})
      const data = await client.createPost({ name: 'sharp is #' })
      expect(data.post.name).toBe('sharp is #')
    })
  })

  describe('updatePost', () => {
    test('update a specific post', async () => {
      const reqBody: UpdatePostParameters = { post: { wip: false } }
      const resBody: Partial<UpdatePostResult['post']> = {
        name: '',
        wip: false,
      }
      mock.onPatch('/teams/acme/posts/1', reqBody).replyOnce(200, resBody, {})
      const data = await client.updatePost(1, { wip: false })
      expect(data.post.wip).toBe(false)
    })

    test('update a specific post with full params', async () => {
      const post: Required<UpdatePostParameters['post']> = {
        name: 'new name',
        tags: ['tag1'],
        wip: true,
        body_md: 'body',
        category: 'category name',
        message: 'message',
        created_by: 'esa_bot',
        updated_by: 'esa_bot',
        original_revision: {
          number: 123,
          body_md: 'old body',
          user: 'esa_bot',
        },
      }
      const reqBody: UpdatePostParameters = { post }
      const resBody: Partial<UpdatePostResult['post']> = { wip: true, name: '' }
      mock.onPatch('/teams/acme/posts/1', reqBody).replyOnce(200, resBody, {})
      const data = await client.updatePost(1, post)
      expect(data.post.wip).toBe(true)
    })

    test('slash in name is replaced with &#47;', async () => {
      const reqBody: UpdatePostParameters = { post: { name: 'foo&#47;bar' } }
      const resBody: Partial<UpdatePostResult['post']> = { name: 'foo&#47;bar' }
      mock.onPatch('/teams/acme/posts/1', reqBody).replyOnce(200, resBody, {})
      const data = await client.updatePost(1, { name: 'foo/bar' })
      expect(data.post.name).toBe('foo/bar')
    })

    test('sharp in name is replaced with &#35;', async () => {
      const reqBody: UpdatePostParameters = { post: { name: 'sharp is &#35;' } }
      const resBody: Partial<UpdatePostResult['post']> = {
        name: 'sharp is &#35;',
      }
      mock.onPatch('/teams/acme/posts/1', reqBody).replyOnce(200, resBody, {})
      const data = await client.updatePost(1, { name: 'sharp is #' })
      expect(data.post.name).toBe('sharp is #')
    })
  })

  test('team name', async () => {
    mock.onGet('/teams/acme/posts').replyOnce<Partial<PostsPayload>>(
      200,
      {
        posts: [],
      },
      {},
    )
    const { team } = await client.getPosts()
    expect(team).toBe('acme')
  })
})
