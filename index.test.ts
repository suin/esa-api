import MockAdapter from 'axios-mock-adapter'
import { createClient, Client, PostsPayload, Post } from './index'

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
      expect(post.number).toBe(1)
    })
  })

  describe('enhead authorization', () => {
    test('token', async () => {
      mock.onGet('/teams/acme/posts').replyOnce(({ headers }) => {
        expect(headers).toMatchObject({ Authorization: 'Bearer mock-token' })
        return [200, {}, {}]
      })
      await client.getPosts()
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
        return [200, {}, {}]
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
          posts: [{}, {}] as Post[],
          next_page: 2,
        },
        {},
      )
      const data = await client.getPosts({ per_page: 2 })
      expect(data.posts.length).toBe(2)
    })

    test('pagination', async () => {
      const post1 = { number: 1 } as Post
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

      const post2 = { number: 2 } as Post
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
  })

  describe('getPost', () => {
    test('get a specific post', async () => {
      mock
        .onGet('/teams/acme/posts/1')
        .replyOnce<Partial<Post>>(200, { number: 1 }, {})
      const data = await client.getPost(1)
      expect(data.post.number).toBe(1)
    })

    test('get a specific post with comments', async () => {
      mock
        .onGet('/teams/acme/posts/1', { params: { include: 'comments' } })
        .replyOnce<Partial<Post>>(200, { number: 1 }, {})
      const data = await client.getPost(1, { include: ['comments'] })
      expect(data.post.number).toBe(1)
    })

    test('get a specific post with comments and stargazers', async () => {
      mock
        .onGet('/teams/acme/posts/1', {
          params: { include: 'comments,stargazers' },
        })
        .replyOnce<Partial<Post>>(200, { number: 1 }, {})
      const data = await client.getPost(1, {
        include: ['comments', 'stargazers'],
      })
      expect(data.post.number).toBe(1)
    })

    test('ratelimit', async () => {
      mock.onGet('/teams/acme/posts/1').replyOnce<Partial<Post>>(
        200,
        { number: 1 },
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
