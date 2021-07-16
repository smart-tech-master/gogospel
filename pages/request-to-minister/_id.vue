<template>
  <v-layout v-if="selectedUser" column justify-center align-center class="profile">
    <v-container class="py-6 mb-15 mt-0 mt-sm-15 pt-0 pt-sm-6">
      <h2 class="text-h3 mb-3 d-none d-sm-block">
        Request {{selectedUser.name}}
      </h2>
      <v-row>
        <v-col cols="12" sm="6" class="mx-auto">
          <div class="profile_top">
            <div class="video_wrapper">
              <vue-plyr
                :ref="`minister_plyr_m1`"
                :options="{controls: customPlyrControls}">
                <video
                  class="hero-videos__video"
                  :src="`${selectedUser.video}#t=0.1`"
                />
              </vue-plyr>
            </div>
            <div class="mt-4">
              <v-chip
                v-for="(item, index) in selectedUser.type"
                :key = "index"
                class="font-weight-bold rounded-lg mr-3">
                {{ item }}
              </v-chip>
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="6" class="mx-auto">
          <p class="title font-weight-bold my-3 d-block d-sm-none">
            Request {{selectedUser.name}}
          </p>
          <request-form :user="selectedUser"/>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  export default {
    data() {
      return {
        userId: null,
        selectedUser: null,
        profiles: [
          // user 1
          {
            video: require('@/assets/videos/love.mp4'),
            name: "Youth Priest Alan",
            api_url: 'https://getform.io/f/5cb4bb75-3fdb-4563-98d5-86a3d2e4a26c',
            type: ["Catholic", "Youth"],
          },
          // user 2
          {
            video: require('@/assets/videos/covid.mp4'),
            name: "Priest Brian",
            api_url: 'https://getform.io/f/ec35b0e3-3409-478f-bf4a-e692cf08a006',
            type: ["Catholic", "Congregation", "Conversion"],
          },
          // user 3
          {
            video: require('@/assets/videos/lgbtq.mp4'),
            name: "Pastor Dennis",
            api_url: 'https://getform.io/f/b921711b-36cc-4dce-be64-6e5322c06cbe',
            type: ["7th Day Adventist", "Black", "Sexuality"],
          },
        ],
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
        </div>`
      }
    },
    mounted() {
      this.getSelectedUser()
    },
    methods: {
      getSelectedUser () {
        this.userId = this.$route.params.id
        // check if user exists in profile array.
        if (!this.userId || this.userId > this.profiles.length) {
          return this.$nuxt.error({ statusCode: 404, message: 'Not found' })
        }
        // set User data.
        const userIndex = this.userId -1
        if (userIndex > -1 && this.profiles.length >= userIndex) {
          this.selectedUser = this.profiles[userIndex]
        }
      }
    }
  }
</script>
