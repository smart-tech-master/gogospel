<template>
  <v-layout column justify-center align-center fill-height>
    <v-container class="py-6 my-md-10">
      <div v-if="isSaving" class="text-center">
        <v-progress-circular
          :size="40"
          color="primary"
          class="mb-4"
          indeterminate
        ></v-progress-circular>
        <h1 class="headline text-h4 text-sm-h3 mb-5 text-center">
          You have successfully created your account. Please wait.
        </h1>
      </div>
      <v-row>
        <v-col v-if="!isSaving" cols="12" md="6" class="mx-auto">
          <div class="auth-form auth-form pa-4 pa-sm-8">
            <h1 class="headline text-h4 text-sm-h3 mb-5 text-center">
              Sign up for goGospel
            </h1>
            <p v-if="error" class="text-center primary--text accent-2">{{error}}</p>
            <v-form v-model="valid" method="POST" enctype="multipart/form-data" @submit.prevent="onSubmit">
              <v-col cols="12" class="pa-0">
                <v-text-field
                  filled
                  v-model="profile.name"
                  :rules="nameRules"
                  label="Name"
                  type="text"
                  name="name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  filled
                  v-model="profile.email"
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
                  v-model="profile.password"
                  :rules="passwordRules"
                  label="Password"
                  type="password"
                  name="password"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" class="pa-0">
                <v-text-field
                  filled
                  v-model="profile.password_confirmation"
                  :rules="[(profile.password === profile.password_confirmation) || 'Password must match']"
                  label="Confirm password"
                  type="password"
                  name="confirm_password"
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
                    Submit
                  </v-btn>
                </v-row>
              </v-col>
            </v-form>
            <div class="text-center w-full mt-5">
              <span class="font-weight-bold primary--text accent-2">Already have an account? <router-link exact to="/login">Sign In</router-link></span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

  export default {
    middleware: 'auth',
    auth: 'guest',
    data() {
      return {
        valid: false,
        error: null,
        profile: {
          name: '',
          email: '',
          // intro_video: '',
          tags: [],
          password: '',
          password_confirmation: ''
        },
        cameraSelected: null,
        cameraFile: null,
        fileSelected: null,
        file: null,
        isSaving: false,
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length <= 24 || 'Name must be less than 24 characters',
        ],
        messageRules: [
          (v) => v.length <= 200 || 'Message must be less than 200 characters',
        ],
        email: '',
        emailRules: [
          (v) => !!v || 'E-mail is required',
          (v) => /.+@.+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          (v) => !!v || 'Password is required',
          (v) => v.length >= 8 || 'Password must be greater than 8 characters',
        ],
        isSuccess: false,
        isMobile: false,
        s3Client: ''
      }
    },
    mounted() {
      this.mobileAndTabletCheck()
      this.s3Client = new S3Client({
        bucketName: 'go-gospel',
        dirName: 'videos',
        region: 'us-east-2',
        credentials: {
          accessKeyId: 'AKIATT26DKJZZMPU674V',
          secretAccessKey: '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'
        },
        s3Url: 'https://go-gospel.us-east-2.amazonaws.com/'
      })
    },
    methods: {
      async onSubmit() {
        await this.submitFormData()
      },
      async uploadFile() {
        const params = {
          Bucket: 'go-gospel',
          Key: `videos/${this.fileSelected}`,
          Body: this.file
        }
        const params_camera = {
          Bucket: 'go-gospel',
          Key: `videos/${this.cameraSelected}`,
          Body: this.cameraFile
        }
        const command = new PutObjectCommand(params)
        const command_camera = new PutObjectCommand(params_camera)

        try {
          this.isSaving = true
          if (!this.cameraSelected && !this.fileSelected) {
            alert('Please select a video')
            this.isSaving = false
            return
          }

          if (this.fileSelected) await this.s3Client.send(command)
          if (this.cameraSelected) await this.s3Client.send(command_camera)
          if (this.fileSelected) {
            this.profile.intro_video = `https://go-gospel.s3.us-east-2.amazonaws.com/videos/${this.fileSelected}`
          } else if (this.cameraSelected) {
            this.profile.intro_video = `https://go-gospel.s3.us-east-2.amazonaws.com/videos/${this.cameraSelected}`
          }
          await this.submitFormData()
          this.isSaving = false
        } catch (e) {
          this.isSaving = false
          console.log('Upload failed:', e)
        }

      },
      async submitFormData() {
        try {
          this.isSaving = true
          await this.$axios.get('/v1/sanctum/csrf-cookie');
          await this.$axios.post('/v1/auth/register', this.profile, {
            headers: {
              Accept: 'application/json'
            },
          })
          this.$auth.$storage.setCookie('_token.cookie', true)
          this.$auth.$storage.setState('loggedIn', true)
          this.isSuccess = true
        } catch (e) {
          this.isSaving = false
          this.error = 'Sign Up failed. Please try again.'
        }
      },
      cameraOutput(e) {
        const str = e.target.value
        this.cameraSelected = str.substring(str.lastIndexOf('\\') + 1)
        this.cameraFile = e.target.files[0]
      },
      fileOutput(e) {
        const str = e.target.value
        this.fileSelected = str.substring(str.lastIndexOf('\\') + 1)
        this.file = e.target.files[0]
      },
      fileValidate(file) {
        if (file) {
          const size = Math.round((file.size / 1024 / 1024));
          return size < 25
        }
      },
      mobileAndTabletCheck() {
        const a = navigator.userAgent || navigator.vendor || window.opera;
        this.isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) ? true : false
      }
    },
  }
</script>

