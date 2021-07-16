<template>
  <v-layout column justify-center align-center>
    <v-container
      :class="{ 'px-0': $vuetify.breakpoint.xs }"
      class="pa-0 ma-0 relative"
      fluid
    >
      <div class="hero-text">
        <div class="container">
          <div class="hero-text__cont">
            <h2 class="headline white--text text-h4 mb-5">
              Contact info
            </h2>
            <h1 class="headline white--text text-h3 mb-5 font-weight-regular font-sans">
              brian@gogospel.io
            </h1>
          </div>
        </div>
      </div>
      <div
        v-if="this.$vuetify.breakpoint.xs"
        class="d-flex hero-videos--mobile">
        <client-only>
          <!-- leave inline style here as this plugin recommends -->
          <video-background
            v-if="this.$vuetify.breakpoint.xs"
            :src="videos[0].link"
            overlay="linear-gradient(45deg,rgba(0, 0, 0, 0.5),rgba(0, 0, 0, 0.5))"
            class="hero-videos--mobile__bg"
            style="
            position: relative;
            max-height: 800px;
            height: 36rem;
            width: 100%;
          "
          />
        </client-only>
      </div>
      <div v-else class="d-flex hero-videos">
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
                :src="video.link"
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
  </v-layout>
</template>

<script>
  export default {
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
        }],
      }
    },
    mounted() {
      this.$nextTick(() => {
        for (let i = 0; i < 5; i++) {
          if(this.$refs[`plyr${ i }`]) {
            const player = this.$refs[`plyr${ i }`][0].player
            if (player) {
              player.on('ready', () => {
                player.muted = true
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
