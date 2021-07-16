<template>
  <v-app dark>
    <v-app-bar class="elevation-0 px-md-12 app-header" height="80px" fixed app>
      <v-toolbar-title>
        <v-img
          :src="logo"
          class="logo"
          alt="goGospel logo"
          @click="$router.push('/')"/>
      </v-toolbar-title>
      <v-spacer/>
      <router-link
        v-if="!$auth.state.loggedIn"
        exact
        class="mr-4 app-header__link d-none d-sm-flex"
        to="/roster">
        Meet the ministers
      </router-link>
      <v-btn
        v-if="!$auth.state.loggedIn"
        depressed
        color="primary"
        class="font-weight-bold text-capitalize rounded-md btn-custom"
        to="/signup"
      >
        Sign up
      </v-btn>
      <a
        v-if="$auth.state.loggedIn"
        href="javascript:"
        class="mr-4 app-header__link d-none d-sm-flex"
        @click.prevent="logout">
        Sign Out
      </a>
      <v-btn
        v-if="$auth.state.loggedIn"
        depressed
        color="primary"
        class="font-weight-bold text-capitalize rounded-md btn-custom"
        to="/profile"
      >
        My Profile
      </v-btn>
    </v-app-bar>
    <v-main>
      <nuxt/>
    </v-main>
    <v-footer
      class="white--text px-12 py-5"
      color="secondary"
      :absolute="!fixed"
      app
    >
      <h4 class="text-body1" @click="$router.push('/')">goGospel</h4>
      <v-spacer/>
      <router-link
        exact
        class="footer-link"
        to="/contact">
        Contact
      </router-link>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    middleware: 'authenticated',
    data() {
      return {
        fixed: false,
        items: [
          {
            icon: 'mdi-apps',
            title: 'Welcome',
            to: '/',
          },
          {
            icon: 'mdi-chart-bubble',
            title: 'Inspire',
            to: '/inspire',
          },
        ],
        logo: require('~/assets/img/logo.svg'),
      }
    },
    mounted() {
      // push gtm
      function gtag() {
        window.dataLayer.push(arguments)
      }

      gtag('js', new Date())
      gtag('config', 'G-9V796YQWWQ')

      this.setUser()
    },
    methods: {
      async logout() {
        await this.$auth.logout()
      },
      async setUser() {
        // if(this.$auth.$state.loggedIn) {
        //   const {data} = await this.$axios.get('/v1/api/user')
        //   this.$auth.setUser(data)
        // }
      }
    }
  }
</script>
