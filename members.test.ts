import { Client, createClient } from './index'

describe('integration', () => {
  let client: Client

  const { ESA_TEAM: team, ESA_TOKEN: token } = process.env as any
  if (typeof team !== 'string' || typeof token !== 'string') {
    console.warn(
      'skipped integration testing since `ESA_TEAM` and `ESA_TOKEN` was not provided',
    )
    test('dummy', () => {})
    return
  }

  beforeEach(() => {
    client = createClient({ team, token })
  })

  test('getMembers', async () => {
    const { members } = await client.getMembers()
    expect(members.length).toBeGreaterThanOrEqual(1)
  })

  test('getMembers pagination', async () => {
    // Checks test data size
    const { total_count } = await client.getMembers()
    if (total_count < 2) {
      console.warn('This test case was skipped because test data is too small')
      return
    }

    // Gets first page
    const { members: members1, next_page } = await client.getMembers({
      per_page: 1,
    })
    expect(members1.length).toBe(1)
    expect(next_page).toBe(2)

    // Gets second page
    const { members: members2 } = await client.getMembers({
      per_page: 1,
      page: next_page!,
    })
    expect(members2.length).toBe(1)
    console.log({ members1, members2 })
  })
})
