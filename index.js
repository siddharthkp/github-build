const axios = require('axios')

class Build {
  constructor(meta) {
    meta.context = meta.label
    meta.target_url = meta.url
    this.meta = meta
  }
  start (message) {return update(this.meta, message, 'pending')}
  pass  (message) {return update(this.meta, message, 'success')}
  fail  (message) {return update(this.meta, message, 'failure')}
  error (message) {return update(this.meta, message, 'error')}
}

const update = (build, message, status) => new Promise((resolve, reject) => {
  axios({
    method: 'POST',
    url: `https://api.github.com/repos/${build.repo}/statuses/${build.sha}`,
    responseType: 'json',
    data: {
      state: status,
      target_url: build.url,
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
