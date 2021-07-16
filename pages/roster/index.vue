<template>
  <v-layout column justify-center align-center>
    <v-container fluid class="py-6 my-10 minister_videos px-md-12">
      <h1 class="headline text-h4 text-sm-h3 mb-5">
        See our ministers
      </h1>
      <div class="roster_videos">
        <client-only>
          <div v-swiper:mySwiper="swiperOptions">
            <div class="swiper-wrapper">
              <div
                v-for="(item, i) in ministerVideos"
                :key="i"
                class="swiper-slide">
                <div class="minister_videos__item mr-md-4">
                  <div class="video_wrapper">
                    <nuxt-link :to="`profiles/${i+1}`">
                      <vue-plyr
                        :ref="`minister_plyr_m${i}`"
                        :options="{enabled: false}">
                        <video
                          class="roster_videos__video"
                          :src="`${item.video}#t=0.1`"
                        />
                      </vue-plyr>
                    </nuxt-link>
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
            </div>
          </div>
        </client-only>
      </div>
    </v-container>
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
        }
      }
    }
  }
</script>
