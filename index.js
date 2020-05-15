const axios = require('axios')

class Build {
  constructor(meta) {
    meta.context = meta.label
    meta.target_url = meta.url
    this.meta = meta
  }
  start (message, url) {return update(this.meta, message, url, 'pending')}
  pass  (message, url) {return update(this.meta, message, url, 'success')}
  fail  (message, url) {return update(this.meta, message, url, 'failure')}
  error (message, url) {return update(this.meta, message, url, 'error')}
}

const update = (build, message, url, status) => new Promise((resolve, reject) => {
  const GH_DOMAIN = build.domain || 'https://api.github.com/';
  const GH_PREFIX = build.prefix || 'repos/';

  const GH_URL = `${GH_DOMAIN}${GH_PREFIX}${build.repo}/statuses/${build.sha}`;

  axios({
    method: 'POST',
    url: GH_URL,
    responseType: 'json',
    data: {
      state: status,
      target_url: url || build.url,
      description: message || build.description,
      context: build.context
    },
    headers: {'Authorization': `token ${build.token}`}
  })
  .then(({status, data}) => resolve({status, data}))
  .catch(({response = {status: 500}}) => reject({
      status: response.status,
      error: response.data
    }))
})

module.exports = Build;
