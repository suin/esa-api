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
})
