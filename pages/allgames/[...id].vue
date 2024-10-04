<template>
  <Loading v-if="isLoading" />
  <v-row>
    <v-btn
      @click="router.replace('/allgames')"
      prepend-icon="mdi-arrow-left"
      text="Back to All Games"
    />
  </v-row>
  <v-row v-if="!isLoading">
    <v-col cols="12" md="12" lg="6">
      <swiper
        :modules="[SwiperFreeMode, SwiperAutoplay, SwiperNavigation]"
        :freeMode="true"
        :grab-cursor="true"
        :navigation="{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }"
        :loop="true"
        :autoplay="{
          delay: 4500,
          disableOnInteraction: false,
        }"
        class="mySwiper"
      >
        <div class="custom-swiper-button-prev d-none pa-2 pa-md-5 cursor-pointer">
          <v-icon icon="mdi-arrow-left" size="x-large" />
        </div>
        <div class="custom-swiper-button-next d-none pa-2 pa-md-5 cursor-pointer">
          <v-icon icon="mdi-arrow-right" size="x-large" />
        </div>
        <swiper-slide class="mySwiper" v-for="slide of game.short_screenshots">
          <v-img class="rounded-lg" :src="slide.image" cover />
        </swiper-slide>
      </swiper>
      <swiper
        :slidesPerView="3"
        :freeMode="true"
        :watchSlidesProgress="true"
        :modules="[SwiperFreeMode, SwiperNavigation, SwiperThumbs]"
      >
        <swiper-slide class="mySwiper2" v-for="slide of game.short_screenshots">
          <v-img class="rounded-lg" :src="slide.image" cover />
        </swiper-slide>
      </swiper>
    </v-col>

    <v-col cols="12" md="12" lg="5" class="d-flex flex-column ga-2">
      <h3 class="text-h5 text-md-h3">{{ game.name }}</h3>

      <div class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Genres: </span>
        <span class="d-inline text-subtitle-1">
          {{ game?.genres.map((genre:any) => genre.name).join(", ") }}
        </span>
      </div>

      <div class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Released: </span>
        <span class="d-inline text-subtitle-1">
          {{ game?.released.substring(0, 4) }}
        </span>
      </div>

      <div class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Metacritic: </span>
        <span class="d-inline text-subtitle-1">
          {{ game?.metacritic }}
        </span>
        <v-icon icon="mdi-trophy" />
      </div>

      <div class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Stores: </span>
        <a
          v-for="store of game?.stores"
          :href="`https://${store.store.domain}`"
          target="_blank"
          class="store-text d-inline transition text-subtitle-1"
        >
          {{ store.store.name }}
        </a>
      </div>

      <div class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Platforms: </span>
        <div class="platforms">
          <span v-for="pl of game?.parent_platforms" class="d-inline">
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('PlayStation')"
              icon="mdi-sony-playstation"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('PC')"
              icon="mdi-microsoft-windows"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('Nintendo Switch' || 'Nintendo Wii')"
              icon="mdi-nintendo-wii"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('Linux')"
              icon="mdi-linux"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('Web')"
              icon="mdi-web"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('Mac')"
              icon="mdi-apple"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('Ios')"
              icon="mdi-apple-ios"
            />
            <v-icon
              class="mr-1"
              size="small"
              v-if="pl.platform.name.includes('Android')"
              icon="mdi-android"
            />
          </span>
        </div>
      </div>

      <div class="mt-5">
        <v-chip class="ma-1" v-for="tag of game.tags" :key="tag.id">{{
          tag.name
        }}</v-chip>
      </div>
    </v-col>
  </v-row>
  <v-responsive height="100" />
  <v-row class="d-flex flex-column justify-start align-start mt-15">
    <h3 class="text-h5 text-md-h4">System Requirements</h3>
    <hr color="#0AE6FF" class="mt-2 mb-10 w-100 w-md-25" />
  </v-row>

  <v-row v-for="systemReq of game.platforms" class="my-5">
    <v-col cols="12" sm="6">
      <v-card height="250" v-if="systemReq?.requirements_en" class="px-5 py-2 rounded-lg">
        <v-card-text v-html="systemReq.requirements_en.minimum"></v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6">
      <v-card height="250" v-if="systemReq?.requirements_en" class="px-5 py-2 rounded-lg">
        <v-card-text v-html="systemReq.requirements_en.recommended"></v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import { SwiperFreeMode, SwiperNavigation, SwiperThumbs } from "#imports";

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);

const game = computed(() => {
  const gameData = route.query.game;
  try {
    isLoading.value = true;
    return typeof gameData === "string" ? JSON.parse(gameData) : null;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
});

onMounted(() => {
  console.log(game);
});
</script>
<style scoped>
.mySwiper {
  position: relative;
}
.custom-swiper-button-prev,
.custom-swiper-button-next {
  position: absolute;
  top: 50%;
  z-index: 99;
  height: 100%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  padding: 1rem;
  color: #fff;
}
.mySwiper:hover .custom-swiper-button-prev {
  display: flex !important;
  justify-content: center;
  align-items: center;
}
.mySwiper:hover .custom-swiper-button-next {
  display: flex !important;
  justify-content: center;
  align-items: center;
}

.custom-swiper-button-prev {
  left: 0;
}
.custom-swiper-button-prev:hover {
  color: #0ae6ff;
}
.custom-swiper-button-next:hover {
  color: #0ae6ff;
}
.custom-swiper-button-next {
  right: 0;
}

.store-text {
  text-decoration: none;
  color: #757575;
}
.store-text:hover {
  color: #0ae6ff;
  text-decoration: underline;
}
</style>
