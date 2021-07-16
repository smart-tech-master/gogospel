<template>
  <v-layout column justify-center align-center>
    <v-container class="py-6 my-md-10">
      <v-row>
        <v-col cols="12" md="6" class="mx-auto">
          <div class="auth-form auth-form pa-4 pa-sm-8">
            <h1 class="headline text-h4 text-sm-h3 mb-5 text-center">
              Log in to goGospel!
            </h1>
            <p v-if="error" class="text-center primary--text accent-2">{{error}}</p>
            <v-form v-model="valid" method="POST" @submit.prevent="handleLogin">
              <v-col cols="12" class="pa-0">
                <v-text-field
                  filled
                  v-model="login.email"
                  :rules="emailRules"
                  label="E-mail"
                  type="email"
                  name="email"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="pa-0">
                <v-text-field
                  filled
                  v-model="login.password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  name="password"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-row>
                  <v-spacer></v-spacer>
                  <v-btn
                    type="submit"
                    color="primary font-weight-bold"
                    style="letter-spacing: -0.04em;"
                    :disabled="!valid || isSaving"
                    large
                    width="100%"
                  >
                    <v-progress-circular
                      v-if="isSaving"
                      :size="25"
                      color="primary"
                      class="mr-4"
                      indeterminate
                    ></v-progress-circular>
                    Log in
                  </v-btn>
                  <div class="text-center w-full mt-5">
                    <span class="font-weight-bold primary--text accent-2">Don't you have an account? <router-link exact to="/signup">Sign Up</router-link></span>
                  </div>
                </v-row>
              </v-col>
            </v-form>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  export default {
    middleware: 'auth',
    auth: 'guest',
    components: {},
    data() {
      return {
        error: null,
        isSaving: false,
        valid: false,
        login: {
          email: '',
          password: ''
        },
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 4 || 'Password must be greater than 4 characters',
        ],
      }
    },
    methods: {
      async handleLogin(event) {
        event.preventDefault()
        this.isSaving = true
        this.error = null
        this.$auth.loginWith('cookie', {data: this.login}).then(async () => {
          const {data} = await this.$axios.get('/v1/api/user')
          this.$auth.setUser(data)
          this.isSaving = false
          await this.$router.push('/')
        }).catch((error) => {
          this.isSaving = false
          if (error.response.status === 422) {
            this.error = 'The email or password you entered doesn\'t match.'
          } else {
            this.error = 'Login failed with unknown error.'
          }
        })
      }
    },

  }
</script>
