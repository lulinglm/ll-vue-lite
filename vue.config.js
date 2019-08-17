const path = require('path')

module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve('src')
      }
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        bypass: function (req, res) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.')
            return '/index.html'
          } else if (process.env.MOCK !== 'none') {
            const name = req.path
              .split('/api/')[1]
              .split('/')
              .join('/')
            const mock = require(`./mock/${name}`)
            console.log(`./mock/${name}`)
            const result = mock(req.method)
            delete require.cache[require.resolve(`./mock/${name}`)]
            return res.send(result) // 跳过转发
          }
        }
      }
    }
  }
}
