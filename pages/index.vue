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
            <h1 class="headline white--text text-h4 text-sm-h3 mb-5">
              Personalized video messages from your favorite spiritual leader.
            </h1>
            <v-btn
              depressed
              nuxt
              color="primary"
              class="font-weight-bold text-capitalize rounded-md ma-2 block btn-custom"
              to="/signup"
            >
              Sign up
            </v-btn>
            <v-btn
              ref="jeu"
              outlined
              nuxt
              color="white"
              class="font-weight-bold text-capitalize rounded-md ma-2 block btn-custom"
              to="/roster"
            >
              Seek Guidance
            </v-btn>
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
              :ref="`plyr${index}`"
              :options="{controls: []}"
            >
              <video
                class="hero-videos__video"
                :src="video.link"
              />
            </vue-plyr>
            <div
              class="hero-videos__video--overlay"
              @mouseover="hoverVideo(index)"
              @mouseleave="leaveVideo(index)"
            />
          </client-only>
        </div>
      </div>
    </v-container>
    <v-container fluid class="py-6 mt-15 minister_videos px-md-12">
      <h1 class="headline text-h4 text-sm-h3 mb-5">
        Real ministers ready to guide you.
      </h1>
      <div>
        <client-only>
          <div v-swiper:mySwiper="swiperOptions">
            <div class="swiper-wrapper">
              <div class="swiper-slide" :key="i" v-for="(item, i) in ministerVideos">
                <div class="minister_videos__item mr-md-4">
                  <div class="video_wrapper">
                    <vue-plyr
                      :ref="`minister_plyr_m${i}`"
                      :options="{controls: customPlyrControls}">
                      <video
                        class="hero-videos__video"
                        :src="`${item.video}#t=0.1`"
                      />
                    </vue-plyr>
                  </div>
                  <nuxt-link
                    :to="`/profiles/${i+1}`"
                    class="font-weight-bold title my-3 black--text d-block roster_videos__link">
                    {{ item.name }}
                  </nuxt-link>
                  <v-chip class="font-weight-bold rounded-lg">
                    {{ item.type }}
                  </v-chip>
                </div>
              </div>
              <div class="swiper-slide">
                <div
                  class="join_ministry text-center d-flex flex-column justify-center"
                  @click="$router.push('/early-access')">
                  <div>
                    <img src="@/assets/img/hand.png" alt="hand" class="mb-2">
                  </div>
                  <p class="white--text font-weight-bold">Join our ministry team</p>
                </div>
              </div>
            </div>
          </div>
        </client-only>
      </div>
    </v-container>
    <v-container class="my-5 mt-10">
      <v-row class="align-center product-view-item">
        <v-col cols="12" sm="5" class="mx-auto">
          <img class="img-responsive" src="@/assets/img/YtYNavix3pw.png" alt="hand">
        </v-col>
        <v-col cols="12" sm="7" class="mx-auto pl-md-5">
          <h2 class="text-h3 mb-3">
            Personalized guidance for you or a loved one.
          </h2>
          <p class="text-body-1">
            Whether you’re going through a difficult period or want to celebrate a wonderful moment, our network of clergymen and women is always available to assist you.
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="my-5">
      <v-row class="align-center product-view-item product-view-item--reverse">
        <v-col cols="12" sm="7" class="mx-auto pr-md-10">
          <h2 class="text-h3 mb-3">
            God’s network is expansive and all inclusive.
          </h2>
          <p class="text-body-1">
            The glory of God is inclusive. Whether you’re a Protestant, Catholic, BIPOC or LGBTQ+, goGospel welcomes any and all people wishing to share the gospel or looking for guidance.
          </p>
        </v-col>
        <v-col cols="12" sm="5" class="mx-auto">
          <img class="img-responsive" src="@/assets/img/H3giJcTw__w.png" alt="hand">
        </v-col>
      </v-row>
    </v-container>
    <div
      v-if="!$auth.state.loggedIn"
      class="primary w-full">
      <v-container>
        <v-row>
          <v-col cols="12" class="text-center">
            <p class="text-body-1 font-weight-bold primary--text--dark">Spread the gospel.</p>
            <router-link
              exact
              class="text-body-1 font-weight-bold white--text"
              to="/signup">
              Sign up now
            </router-link>
          </v-col>
        </v-row>
      </v-container>
    </div>

<!--    <v-container class="py-6 my-15">-->
<!--      <v-row>-->
<!--        <v-col cols="12" sm="6" class="mx-auto">-->
<!--          <h2 class="text-h3 mb-3">-->
<!--            Grow your church with counsel for anyone.-->
<!--          </h2>-->
<!--          <p class="text-body-1">-->
<!--            Everyone needs counsel, but not everyone has time to attend church.-->
<!--            Sign-up to start helping people within your congregation and beyond.-->
<!--          </p>-->
<!--        </v-col>-->
<!--        <v-col cols="12" sm="6" class="mx-auto">-->
<!--          <ContactForm/>-->
<!--        </v-col>-->
<!--      </v-row>-->
<!--    </v-container>-->

  </v-layout>
</template>

<script>
import ContactForm from '@/components/ContactForm'
import { directive } from 'vue-awesome-swiper'

export default {
  directives: {
    swiper: directive
  },
  components: {
    ContactForm,
  },
  data() {
    return {
      ministerVideos: [
        {
          video: require('@/assets/videos/love.mp4'),
          name: "Youth Priest Alan",
          type: "Catholic"
        },
        {
          video: require('@/assets/videos/covid.mp4'),
          name: "Priest Brian",
          type: "Catholic"
        },
        {
          video: require('@/assets/videos/lgbtq.mp4'),
          name: "Pastor Dennis",
          type: "7th Day Adventist"
        }
      ],
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
        </div>`
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
