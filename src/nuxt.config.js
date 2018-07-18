module.exports = {
  head: {
    title: 'Vuetiful Korea meetup',
    meta: [
      {charset: 'utf-8'},
      {name: 'viewport', content: 'width=device-width, initial-scale=1'},
      {hid: 'description', name: 'description', content: 'Vuetiful Korea meetup'}
    ],
    link: [
      {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'},
      {rel: 'stylesheet', type: 'text/css', href: 'https://cdn.jsdelivr.net/npm/semantic-ui@2.3.3/dist/semantic.min.css'}
    ]
  },
  plugins: [
    '~/plugins/vuetiful.js'
  ],
  buildDir: '../prod/server/nuxt',
  build: {
    publicPath: '/assets/',
    extractCSS: true,
    babel: {
      presets: [
        'es2015',
        'stage-0'
      ],
      plugins: [
        ["transform-runtime", {
          "polyfill": true,
          "regenerator": true
        }]
      ]
    }
  }
}
