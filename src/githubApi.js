import * as github from '@actions/github'

export class GithubApi {
  constructor () {
    this.body = github.context.payload.release.body
    this.tag_name = github.context.payload.release.tag_name
    this.html_url = github.context.payload.release.html_url
    this.full_name = github.context.payload.repository.full_name
  }
}
