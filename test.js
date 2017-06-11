const Build = require('./index')

const data = {
  repo: process.env.TRAVIS_REPO_SLUG,
  sha: process.env.TRAVIS_PULL_REQUEST_SHA,
  token: process.env.github_token,
  label: 'github-build',
  description: 'Running some tests'
}

const build = new Build(data)
build.start()
build.pass('Tests passed!')
