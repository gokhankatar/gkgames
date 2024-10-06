<template>
  <Loading v-if="_store.isLoading" />

  <v-row v-if="!_store.isLoading" class="d-flex flex-column mt-10">
    <h3 class="text-h5 text-md-h4 text-xl-h3">Popular Genres</h3>
    <hr class="mt-2 mb-10 w-75 w-md-25" color="#0AE6FF" />
    <v-col cols="12">
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
          delay: 3000,
          disableOnInteraction: false,
        }"
        :breakpoints="{
          '@0.00': {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          '@0.75': {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          '@1.00': {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          '@1.50': {
            slidesPerView: 5,
            spaceBetween: 40,
          },
        }"
        class="mySwiper"
      >
        <div class="custom-swiper-button-prev pa-5 cursor-pointer">
          <v-icon icon="mdi-arrow-left" size="x-large" color="white" />
        </div>
        <div class="custom-swiper-button-next pa-5 cursor-pointer">
          <v-icon icon="mdi-arrow-right" size="x-large" color="white" />
        </div>
        <SwiperSlide class="swiper-slide" v-for="item of _store.genres" :key="item.id">
          <v-img
            class="image transition rounded-xl transition"
            :src="item?.image_background"
            height="450"
            cover
          />
          <div class="content pa-3 rounded-lg">
            <h3 class="text-subtitle-1 text-white text-xl-h5">{{ item.name }}</h3>
          </div>
          <div
            @click="
              router.push({
                path: `/browse/${item.name}`,
                query: {
                  name: item.name,
                  endPoint: `https://api.rawg.io/api/games?key=${api_key}&genres=${item.slug}`,
                },
              })
            "
            class="content-hidden pa-3 rounded-lg d-none cursor-pointer"
          >
            <h5 class="text-subtitle-1 text-md-h5 text-center">See All</h5>
          </div>
        </SwiperSlide>
      </swiper>
    </v-col>
  </v-row>

  <v-row
    v-if="!_store.isLoading"
    class="d-flex justify-center align-center ga-2 ga-sm-5 my-15"
  >
    <v-btn
      class="d-none d-sm-flex transition category-btn"
      @click="getAllGames(item)"
      :class="_store.activeCategory === item.name ? 'active-category' : ''"
      v-for="(item, index) of categories"
      :key="index"
      variant="outlined"
      :text="item.name"
      rounded="xl"
      size="x-large"
    />
    <v-btn
      class="d-flex d-sm-none transition category-btn"
      @click="getAllGames(item)"
      :class="activeCategory === item.name ? 'active-category' : ''"
      v-for="(item, index) of categories"
      :key="index"
      variant="outlined"
      :text="item.name"
      rounded="xl"
      size="x-large"
    />
  </v-row>

  <v-row v-if="!_store.isLoading">
    <v-col
      @click="
        router.push({
          path: `/allgames/${item.name}`,
          query: { game: JSON.stringify(item) },
        })
      "
      class="game-wrapper cursor-pointer"
      v-for="(item, index) of gamesList"
      :key="item.id"
      cols="12"
      sm="6"
      lg="3"
    >
      <img
        height="320"
        width="100%"
        :src="item.background_image"
        class="image cursor-pointer transition rounded-lg transition"
      />
      <v-icon class="icon d-none pa-5 rounded-xl cursor-pointer" icon="mdi-heart" />
      <span class="metacritic d-none pa-2 rounded-lg">{{ item?.metacritic }}</span>
      <div class="content-info d-flex flex-column ga-2 rounded-lg pa-3">
        <span class="info-name d-flex text-subtitle-1 text-md-h5">{{ item.name }}</span>
        <div class="d-flex justify-space-between align-center">
          <span class="text-grey">Genres: </span>
          <span class="d-inline text-caption">
            {{ item?.genres.map((genre:any) => genre.name).join(", ") }}
          </span>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span class="text-grey">Released: </span>
          <span class="d-inline text-caption">
            {{ item?.released.substring(0, 4) }}
          </span>
        </div>
        <div class="d-flex justify-space-between align-center">
          <span class="text-grey">Platforms: </span>
          <div class="platforms">
            <span v-for="pl of item?.parent_platforms" class="d-inline">
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
      </div>
    </v-col>
  </v-row>

  <v-row v-if="!isLoading" class="mt-15 flex justify-center align-center ga-3">
    <v-btn v-if="previousPageUrl" @click="getAllGames(previousPageUrl)">prev page</v-btn>
    <v-btn v-if="nextPageUrl" @click="getAllGames(nextPageUrl)">next page</v-btn>
  </v-row>
</template>
<script lang="ts" setup>
import store from "~/store/store";

const router = useRouter();
const _store = store();

const isLoading = ref(false);
const api_key = useRuntimeConfig().app.apiKey;
const initialCategoryEndPoint = `https://api.rawg.io/api/games?key=${api_key}&ordering=-added_by_status.beaten`;
const previousPageUrl = ref(null);
const nextPageUrl = ref(null);
const gamesList = ref([]);
const categories = [
  {
    name: "Coming Soon",
    url: `https://api.rawg.io/api/games?key=${api_key}&dates=2024-10-05,2025-10-05&ordering=released`,
  },
  {
    name: "Recently Added",
    url: `https://api.rawg.io/api/games?key=${api_key}&ordering=-added
`,
  },
  {
    name: "Top Rated",
    url: `https://api.rawg.io/api/games?key=${api_key}&ordering=-rating`,
  },
];
const activeCategory = ref(null);

const getAllGames = async (item: any) => {
  try {
    isLoading.value = true;
    let url;
    if (activeCategory.value === item.name) {
      activeCategory.value = null;
      url = initialCategoryEndPoint;
    } else {
      activeCategory.value = item.name;
      url = item.url;
    }
    const data = await $fetch(url);
    gamesList.value = data?.results;

    nextPageUrl.value = data?.next;
    previousPageUrl.value = data?.previous;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const formattedDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

onMounted(async () => {
  await nextTick();
  _store.getGenres();
});
</script>
<style scoped>
@import url(/assets/css/main.css);

.swiper-slide {
  position: relative;
}
.content {
  position: absolute;
  bottom: 3%;
  left: 3%;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
}
.content-hidden {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 999;
  background-color: rgba(255, 255, 255, 0.5);
}
.content-hidden:hover {
  background-color: rgba(0, 255, 255, 0.5);
}
.swiper-slide:hover .content-hidden {
  display: flex !important;
}
.swiper-slide:hover .content {
  display: none !important;
}
.swiper-slide:hover .image {
  scale: 1.02;
  overflow: hidden;
  filter: brightness(0.3);
}
.custom-swiper-button-prev,
.custom-swiper-button-next {
  position: absolute;
  top: 50%;
  z-index: 99;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
.custom-swiper-button-prev {
  left: 0;
}
.custom-swiper-button-next {
  right: 0;
}
.category-btn:hover {
  border-color: #0ae6ff !important;
  color: #0ae6ff !important;
}
.active-category {
  background-color: #0ae6ff !important;
  border-color: #0ae6ff !important;
  color: #fff !important;
}
</style>
