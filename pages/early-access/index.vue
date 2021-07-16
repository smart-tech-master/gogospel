<template>
  <v-layout column justify-center align-center>
    <v-container
      :class="{ 'px-0': $vuetify.breakpoint.xs }"
      class="pa-0 ma-0 relative"
      fluid
    >
      <div class="hero-text">
        <div class="mx-auto hero-text__cont--centered">
          <h1 class="headline white--text text-h4 text-sm-h3 mb-5">
            Grow your church with counsel for anyone.
          </h1>
          <p class="white--text mb-5">
            Everyone needs counsel, but not everyone has time to attend church. Sign-up to start helping people within your congregation and beyond.
          </p>
        </div>
      </div>

      <div class="d-flex hero-videos--mobile" v-if="this.$vuetify.breakpoint.xs">
        <client-only>
          <video-background
            v-if="this.$vuetify.breakpoint.xs"
            :src="videos[0].link"
            overlay="linear-gradient(45deg,rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5))"
            style="
            position: relative;
            max-height: 800px;
            height: 36rem;
            width: 100%;
          "
          />
        </client-only>
      </div>
      <div class="d-flex hero-videos" v-else>
        <div class="video_wrapper"
             v-for="(video, index) in videos"
             :key="index"
        >
          <client-only>
            <vue-plyr
              v-show="video.ready"
              :ref="`plyr${index}`"
              :options="{controls: []}"
            >
              <video
                class="hero-videos__video"
                muted
                :src="`${video.link}#t=0.1`"
              />
            </vue-plyr>
            <div
              v-show="video.ready"
              class="hero-videos__video--overlay"
              @mouseover="hoverVideo(index)"
              @mouseleave="leaveVideo(index)"
            />
          </client-only>
        </div>
      </div>
    </v-container>
    <v-container class="py-6 my-md-10">
      <v-row>
        <v-col cols="12" sm="6" class="mx-auto">
          <h1 class="headline text-h4 text-sm-h3 mb-5">
            Become a minister for goGospel.
          </h1>
          <ContactForm/>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>

<script>
  import ContactForm from '@/components/ContactForm'

  export default {
    components: {
      ContactForm,
    },
    data() {
      return {
        videos: [{
          link: require('@/assets/videos/hero1.mp4'),
          ready: false
        }, {
          link: require('@/assets/videos/hero2.mp4'),
          ready: false
        }, {
          link: require('@/assets/videos/hero3.mp4'),
          ready: false
        }, {
          link: require('@/assets/videos/hero4.mp4'),
          ready: false
        }, {
          link: require('@/assets/videos/hero5.mp4'),
          ready: false
        }]
      }
    },
    mounted() {
      this.$nextTick(() => {
        for (let i = 0; i < 5; i++) {
          if(this.$refs[`plyr${ i }`]) {
            const player = this.$refs[`plyr${ i }`][0].player
            if (player) {
              player.on('ready', () => {
                this.videos[i].ready = true
              })
            }
          }
        }
      })
    },
    methods: {
      hoverVideo(index) {
        const player = this.$refs[`plyr${ index }`][0].player
        this.playVideo(player)
      },
      leaveVideo(index) {
        const player = this.$refs[`plyr${ index }`][0].player
        this.pauseVideo(player)
      },
      playVideo(player) {
        if (player && !player.playing) {
          player.play()
        }
      },
      pauseVideo(player) {
        if (player && player.playing) {
          player.pause()
        }
      }
    }
  }
</script>
