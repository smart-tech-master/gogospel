<template>
  <v-layout v-if="profile" column justify-center align-center class="profile">
    <v-alert
      v-if="isSaved"
      dense
      text
      color="success"
      class="w-full text-center"
    >
      Your profile changes were successfully saved.
      <router-link
        exact
        class="font-weight-black success--text"
        to="/profile">
        See profile
      </router-link>
    </v-alert>
    <v-container class="py-6 mb-15 pt-0 pt-sm-6">
      <v-form v-model="valid" method="POST" enctype="multipart/form-data" @submit.prevent="onSubmit">
        <div class="d-sm-flex justify-space-between align-center mb-4">
          <h2 class="text-h3">
            Update your profile
          </h2>
          <v-btn
            depressed
            type="submit"
            color="primary"
            :disabled="!valid || isSaving"
            class="font-weight-bold text-none rounded-md py-5 btn-custom text-right my-3"
          >
            <v-progress-circular
              v-if="isSaving"
              :size="25"
              color="primary"
              class="mr-4"
              indeterminate
            ></v-progress-circular>
            Save Changes
          </v-btn>
        </div>
        <div>
          <h2 class="text-h4">
            Profile Video
          </h2>
          <p>
            Use this video to intro yourself and your specialties.
          </p>
        </div>
        <v-row class="bg-white mb-10">
          <v-col cols="12" sm="6" class="mx-auto">
            <div class="profile_top" v-if="profile.video">
              <div class="video_wrapper">
                <vue-plyr
                  :ref="`minister_plyr_m1`"
                  :options="{controls: customPlyrControls}">
                  <video
                    class="hero-videos__video"
                    :src="`${profile.video.link}#t=0.1`"
                  />
                </vue-plyr>
              </div>
            </div>
          </v-col>
          <v-col cols="12" sm="6" class="mx-auto d-flex flex-column justify-center">
            <div>
              <div class="d-sm-block d-md-none" v-if="isMobile">
                <v-btn
                  color="secondary"
                  class="font-weight-bold elevation-0 text-none"
                  style="width: 100%; letter-spacing: -0.05em;"
                  large
                  @click="$refs.cameraUpload.click()"
                >
                  <v-icon>mdi-camera-outline</v-icon>
                  &nbsp;Open the camera
                </v-btn>

                <p v-if="this.cameraSelected">{{ cameraSelected }}</p>

                <input
                  v-show="false"
                  ref="cameraUpload"
                  type="file"
                  accept="video/*"
                  capture="camera"
                  @change="cameraOutput"
                />

                <p class="caption text-center my-2">or</p>
              </div>

              <v-btn
                color="blue-grey lighten-1"
                class="font-weight-bold elevation-0 text-none"
                style="width: 100%; letter-spacing: -0.05em;"
                large
                outlined
                @click="$refs.fileUpload.click()"
              >
                <v-icon>mdi-cloud-upload-outline</v-icon>
                &nbsp;Upload a video
              </v-btn>

              <p v-if="this.fileSelected">{{ fileSelected }}</p>

              <input
                v-show="false"
                ref="fileUpload"
                type="file"
                accept="video/*"
                @change="fileOutput"
              />
            </div>
          </v-col>
        </v-row>
        <div>
          <h2 class="text-h4">
            Profile Details
          </h2>
          <p>
            Tell everyone about the services you offer.
          </p>
        </div>
        <div class="edit-profile--form px-4 py-8">
          <v-col cols="12" class="pa-0">
            <v-text-field
              filled
              v-model="profile.name"
              :rules="nameRules"
              label="Display Name"
              type="text"
              name="name"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-text-field
              filled
              v-model="newTag"
              label="Add Tag"
              type="text"
              name="tag"
              required
              @keypress.enter="addTag"
            ></v-text-field>
            <div v-if="profile.tags" class="tags-group mb-5">
              <v-chip
                v-for="(item, index) in profile.tags"
                :key="index"
                class="ma-2"
                close
                @click:close="removeTag(index)"
              >
                {{item}}
              </v-chip>
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-textarea
              filled
              v-model="profile.description"
              name="description"
              :rules="descriptionRules"
              label="Describe yourself"
              required
            ></v-textarea>
          </v-col>
        </div>
        <div class="text-center mt-5">
          <v-btn
            depressed
            type="submit"
            color="primary"
            :disabled="!valid || isSaving"
            class="font-weight-bold text-none rounded-md py-5 btn-custom text-right"
          >
            <v-progress-circular
              v-if="isSaving"
              :size="25"
              color="primary"
              class="mr-4"
              indeterminate
            ></v-progress-circular>
            Save Changes
          </v-btn>
        </div>
      </v-form>
    </v-container>
  </v-layout>
</template>

<script>
  import {S3Client, PutObjectCommand} from "@aws-sdk/client-s3"

  export default {
    middleware: 'auth',
    data() {
      return {
        valid: false,
        isSaving: false,
        videos: [],
        profile: null,
        userId: null,
        cameraSelected: null,
        cameraFile: null,
        fileSelected: null,
        file: null,
        isSaved: false,
        nameRules: [
          (v) => !!v || 'Name is required',
          (v) => v.length <= 24 || 'Name must be less than 24 characters',
        ],
        descriptionRules: [
          (v) => !!v || 'Description is required',
          (v) => v.length >= 10 || 'Description must be less than 10 characters',
        ],
        newTag: '',
        tagRule: [
          (v) => !!v || 'Tag is required',
          (v) => v.length <= 24 || 'Tag must be less than 24 characters',
        ],
        isMobile: false,
        swiperOptions: {
          slidesPerView: 1.2,
          spaceBetween: 12,
          centeredSlides: true,
          grabCursor: true,
          observer: true,
          observeParents: true,
          breakpoints: {
            600: {
              slidesPerView: 1.2,
              noSwiping: true,
            },

            960: {
              slidesPerView: 2.8,
              initialSlide: 0,
              noSwiping: true,
              centeredSlides: false,
              allowSlidePrev: true,
              allowSlideNext: true
            },

            1024: {
              slidesPerView: 4,
              centeredSlides: false,
              noSwiping: false,
              allowSlidePrev: false,
              allowSlideNext: false
            }

          }
        },
        customPlyrControls: `
        <div class="play_button--custom">
          <button type="button" class="plyr__control plyr__controls__item plyr__custom--play" data-plyr="play" aria-label="Play">
            <svg class="icon--not-pressed"  width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.5" d="M40 0C17.9107 0 0 17.9107 0 40C0 62.0893 17.9107 80 40 80C62.0893 80 80 62.0893 80 40C80 17.9107 62.0893 0 40 0ZM52.8661 40.6161L33.3661 54.8036C33.2592 54.8804 33.1332 54.9263 33.0019 54.9361C32.8706 54.946 32.7392 54.9195 32.622 54.8595C32.5048 54.7995 32.4064 54.7084 32.3376 54.5961C32.2689 54.4839 32.2324 54.3549 32.2321 54.2232V25.8661C32.2317 25.7342 32.2678 25.6047 32.3364 25.4921C32.4051 25.3794 32.5036 25.288 32.621 25.2279C32.7384 25.1678 32.8702 25.1414 33.0017 25.1516C33.1332 25.1618 33.2593 25.2082 33.3661 25.2857L52.8661 39.4643C52.9582 39.5294 53.0333 39.6157 53.0852 39.7159C53.1371 39.8162 53.1642 39.9273 53.1642 40.0402C53.1642 40.153 53.1371 40.2642 53.0852 40.3644C53.0333 40.4646 52.9582 40.5509 52.8661 40.6161Z" fill="#F0F0F0"/>
            </svg>
            <span class="plyr__sr-only">Play</span></button>
        </div>
        <div class="plyr__controls">
          <button type="button" class="plyr__control plyr__controls__item" aria-label="Play, {title}" data-plyr="play">
            <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-pause"></use></svg>
            <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-play"></use></svg>
            <span class="label--pressed plyr__tooltip" role="tooltip">Pause</span>
            <span class="label--not-pressed plyr__tooltip" role="tooltip">Play</span>
          </button>
          <button type="button" class="plyr__control plyr__controls__item" aria-label="Mute" data-plyr="mute">
            <svg class="icon--pressed" role="presentation"><use xlink:href="#plyr-muted"></use></svg>
            <svg class="icon--not-pressed" role="presentation"><use xlink:href="#plyr-volume"></use></svg>
            <span class="label--pressed plyr__tooltip" role="tooltip">Unmute</span>
            <span class="label--not-pressed plyr__tooltip" role="tooltip">Mute</span>
          </button>
          <div class="plyr__volume plyr__controls__item">
            <input data-plyr="volume" type="range" min="0" max="1" step="0.05" value="1" autocomplete="off" aria-label="Volume">
          </div>
        </div>`,
        s3Client: ''
      }
    },
    computed: {
      currentUser() {
        return this.$auth.state.user
      },
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
      this.profile = JSON.parse(JSON.stringify(this.$auth.state.user))
    },
    methods: {
      async onSubmit() {
        this.isSaving = true
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

        if (this.fileSelected) await this.s3Client.send(command)
        if (this.cameraSelected) await this.s3Client.send(command_camera)

        try {
          if (this.fileSelected) {
            this.profile.intro_video = `https://go-gospel.s3.us-east-2.amazonaws.com/videos/${this.fileSelected}`
          } else if (this.cameraSelected) {
            this.profile.intro_video = `https://go-gospel.s3.us-east-2.amazonaws.com/videos/${this.cameraSelected}`
          }
          await this.$axios.put('/v1/auth/user/profile-information', this.profile, {
            headers: {
              Accept: 'application/json'
            },
          })
          const {data} = await this.$axios.get('/v1/api/user')
          this.$auth.setUser(data)
          this.profile = JSON.parse(JSON.stringify(this.$auth.state.user))
          this.isSaved = true
          this.isSaving = false
        } catch (e) {
          this.isSaving = false
          console.log(e)
        }
      },
      addTag() {
        this.profile.tags.push(this.newTag)
        this.newTag = ''
      },
      removeTag(index) {
        this.profile.tags.splice(index, 1)
        this.profile.tags = [...this.profile.tags]
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
      mobileAndTabletCheck() {
        const a = navigator.userAgent || navigator.vendor || window.opera;
        this.isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) ? true : false
      }
    }
  }
</script>

<style lang="scss">
  .edit-profile--form {
    background: #ffffff;
  }
</style>
