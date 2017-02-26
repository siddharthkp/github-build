const axios = require('axios')

class Build {
  constructor(meta) {
    meta.context = meta.label
    meta.target_url = meta.url
    this.meta = meta
  }
  start () {return update(this.meta, 'pending')}
  pass  () {return update(this.meta, 'success')}
  fail  () {return update(this.meta, 'failure')}
  error () {return update(this.meta, 'error')}
}

const update = (build, status) => new Promise((resolve, reject) => {
  axios({
    method: 'POST',
    url: `https://api.github.com/repos/${build.repo}/statuses/${build.sha}`,
    responseType: 'json',
    data: {
      state: status,
      target_url: build.url,
      description: build.description,
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
