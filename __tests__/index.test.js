import * as github from '@actions/github'
import { GithubApi } from '../src/githubApi'
import { getContext } from '../src/index'

// Shallow clone original @actions/github context
const originalContext = { ...github.context }

afterEach(() => {
  // Restore original @actions/github context
  Object.defineProperty(github, 'context', {
    value: originalContext
  })
})

test('normal output format', async () => {
  // Mock the @actions/github context.
  Object.defineProperty(github, 'context', {
    value: {
      payload: {
        release: {
          body: 'changes',
          tag_name: 'v1.0.0',
          html_url: 'https://github.com'
        },
        repository: {
          full_name: 'my_repo'
        }
      }
    }
  })

  const githubApi = new GithubApi()
  const context = await getContext()

  expect(githubApi.body).toStrictEqual(context.body)
  expect(githubApi.tag_name).toStrictEqual(context.tag_name)
  expect(githubApi.html_url).toStrictEqual(context.html_url)
  expect(githubApi.full_name).toStrictEqual(context.full_name)
})

test('body exceeds 1500 characters', async () => {
  // Mock the @actions/github context.
  Object.defineProperty(github, 'context', {
    value: {
      payload: {
        release: {
          body: 'changes'.repeat(215)
        },
        repository: {
          full_name: 'my_repo'
        }
      }
    }
  })

  const githubApi = new GithubApi()
  const context = await getContext()

  expect(githubApi.body.substring(0, 1500) + ` ([...](${githubApi.html_url}))`).toStrictEqual(context.body)
})
