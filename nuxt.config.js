import colors from 'vuetify/es5/util/colors'

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'goGospel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Personalized video messages from your favorite spiritual leader',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    script: [
      { src: 'https://www.googletagmanager.com/gtag/js?id=G-9V796YQWWQ', async: true },
      {
        hid: 'gtm',
        innerHTML: `window.dataLayer = window.dataLayer || [];`,
        type: 'text/javascript'
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: ['~/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    {
      src: '~/plugins/vue-video-background',
      ssr: false,
    },
    { src: '~/plugins/vue-plyr', mode: 'client' },
    { src: '~/plugins/vue-awesome-swiper', mode: 'client' }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/proxy'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    proxy: true,
    credentials: true,
    headers: {
      common: {
        Accept: 'application/json'
      }
    }
  },
  // Proxy module configuration (https://axios.nuxtjs.org/options/#proxy)
  proxy: {
    '/v1': {
      target: 'http://3.20.255.175',
      pathRewrite: { '^/v1': '/' },
      changeOrigin: true
    }
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/scss/variables.scss'],
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#FD5764',
          secondary: '#273149',
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  auth: {
    plugins: ['~/plugins/axios'],
    redirect: {
      login: '/login',
      logout: '/',
      home: '/profile'
    },
    strategies: {
      cookie: {
        token: {
          required: false,
          type: false
        },
        cookie: {
          // (optional) If set we check this cookie existence for loggedIn check
          name: 'XSRF-TOKEN'
        },
        user: {
          property: false,
          autoFetch: false
        },
        endpoints: {
          // (optional) If set, we send a get request to this endpoint before login
          csrf: {
            url: '/v1/sanctum/csrf-cookie'
          },
          login: {
            url: '/v1/auth/login',
            method: 'post'
          },
          logout: {
            url: '/v1/auth/logout',
            method: 'post'
          },
          user: false
        }
      }
    }
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
}
