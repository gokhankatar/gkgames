<template>
  <Loading v-if="isLoading" />

  <!-- head -->
  <v-row
    v-if="!isLoading"
    class="d-flex justify-space-between align-start mt-2 mt-sm-0 pa-3"
  >
    <div class="content-title">
      <h3 class="text-subtitle-1 font-weight-bold text-lg-h3">Gamemixer</h3>
      <hr class="mt-2 mb-10 w-100" color="#0AE6FF" />
    </div>
    <v-btn
      class="back-btn d-none d-sm-flex rounded-lg transition text-white"
      color="cyan"
      size="x-large"
      @click="router.replace('/allgames')"
      prepend-icon="mdi-arrow-left"
      text="Back"
    />
    <v-btn
      class="back-btn d-flex d-sm-none rounded-lg transition text-white"
      color="cyan"
      @click="router.replace('/allgames')"
      prepend-icon="mdi-arrow-left"
      text="Back"
      size="small"
    />
  </v-row>

  <!-- select games -->
  <v-row class="main-container px-0 px-sm-6 px-md-9 px-lg-12 px-xl-15">
    <!-- game1 -->
    <v-col cols="5" class="main-container1">
      <v-card
        @click="goToGame1"
        height="40vh"
        class="rounded-lg d-flex justify-center align-center"
      >
        <v-card-text v-if="!primaryGame.item" class="text-center text-h5 text-md-h3"
          >Game 1</v-card-text
        >
        <v-img
          class="item-image h-100 rounded-lg transition cursor-pointer"
          v-if="primaryGame.item?.background_image"
          :src="primaryGame.item?.background_image"
          cover
        />
      </v-card>
      <v-text-field
        class="mt-5"
        v-model="models.primaryGame"
        @input="searchGame"
        color="#00e5ff"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="lg"
        label="Primary Game"
        placeholder="Elden Ring"
      />
      <div class="search-results rounded-lg pa-3">
        <v-progress-circular
          v-if="isSmLoading"
          class="smLoadingBar"
          :size="30"
          :width="3"
          color="blue-lighten-1"
          indeterminate
        />

        <div
          v-if="gamesFoundPrimary.length > 0 && !isSmLoading"
          class="search-wrapper d-flex flex-column ga-1 ga-md-2 rounded-lg pa-3 pa-md-5"
        >
          <div
            @click="setPrimaryGame(item)"
            v-for="item of gamesFoundPrimary"
            :key="item?.id"
            class="game text-white rounded-lg pa-1 pa-md-5 cursor-pointer transition d-flex justify-start align-center ga-2"
          >
            <img class="rounded-lg game-image" :src="item?.background_image" cover />
            <div class="context d-flex flex-column">
              <span class="game-title text-subtitle-2 text-md-subtitle-1">{{
                item.name
              }}</span>
              <div class="d-flex flex-wrap">
                <span
                  class="game-genre text-caption text-md-subtitle-2"
                  v-for="genre of item?.genres"
                >
                  {{ genre.name + " " }}&nbsp;
                </span>
              </div>
              <span class="game-date d-inline text-caption">
                {{ item?.released?.substring(0, 4) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-col>

    <!-- mid -->
    <v-col cols="2" class="d-flex flex-column justify-center align-center ga-5">
      <img
        v-if="!isAnim"
        class="d-flex d-md-none"
        width="30"
        src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-28/512/1034_Add_new_plus_sign-512.png"
      />
      <img
        v-if="!isAnim"
        class="d-none d-sm-flex"
        width="150"
        src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-28/512/1034_Add_new_plus_sign-512.png"
      />
      <img
        v-if="isAnim"
        class="anim-img d-none d-sm-flex"
        width="150"
        src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-28/512/1034_Add_new_plus_sign-512.png"
      />
      <span class="text-caption text-sm-subtitle-1">or try a</span>
      <v-btn
        class="rounded-lg transition"
        color="cyan"
        prepend-icon="mdi-magnify"
        text="random"
      />
      <v-btn
        @click="clear"
        class="rounded-lg transition"
        color="error"
        prepend-icon="mdi-delete"
        text="clear"
      />
    </v-col>

    <!-- game2 -->
    <v-col cols="5" class="main-container2">
      <v-card
        @click="goToGame2"
        height="40vh"
        class="rounded-lg d-flex justify-center align-center"
      >
        <v-card-text v-if="!secondaryGame.item" class="text-center text-h5 text-md-h3"
          >Game 2</v-card-text
        >
        <v-img
          class="item-image2 h-100 rounded-lg transition cursor-pointer"
          v-if="secondaryGame.item?.background_image"
          :src="secondaryGame.item?.background_image"
          cover
        />
      </v-card>
      <v-text-field
        class="mt-5"
        v-model="models.secondaryGame"
        @input="searchGame2"
        color="#00e5ff"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="lg"
        label="Secondary Game"
        placeholder="Lies of P"
      />

      <div class="search-results2 rounded-lg pa-3">
        <v-progress-circular
          v-if="isSmLoading2"
          class="smLoadingBar2"
          :size="30"
          :width="3"
          color="blue-lighten-1"
          indeterminate
        />

        <div
          v-if="gamesFoundSecondary.length > 0"
          class="search-wrapper2 d-flex flex-column ga-1 ga-md-2 rounded-lg pa-3 pa-md-5"
        >
          <div
            @click="setSecondaryGame(item)"
            v-for="item of gamesFoundSecondary"
            :key="item?.id"
            class="game text-white rounded-lg pa-1 pa-md-5 cursor-pointer transition d-flex justify-start align-center ga-2"
          >
            <img class="rounded-lg game-image" :src="item?.background_image" cover />
            <div class="context d-flex flex-column">
              <span class="game-title text-subtitle-2 text-md-subtitle-1">{{
                item.name
              }}</span>
              <div class="d-flex flex-wrap">
                <span
                  class="game-genre text-caption text-md-subtitle-2"
                  v-for="genre of item?.genres"
                >
                  {{ genre.name + " " }}&nbsp;
                </span>
              </div>
              <span class="game-date d-inline text-caption">
                {{ item?.released?.substring(0, 4) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>

  <!-- gameResults -->
  <v-row v-if="!isAnim && gameResults.length > 0" class="mt-15">
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div class="content-wrapper d-flex justify-center align-center ga-2 cursor-pointer">
        <h3 class="font-weight-bold text-subtitle-1 text-sm-h5">Results</h3>
        <v-icon
          class="right-icon d-none d-sm-flex transition-lg"
          icon="mdi-chevron-right"
          size="large"
        />
        <v-icon
          class="right-icon d-flex d-sm-none transition-lg"
          icon="mdi-chevron-right"
        />
      </div>

      <div class="actions-swiper d-flex justify-center align-center ga-2">
        <div class="newGames-swiper-button-prev pa-2 transition cursor-pointer">
          <v-icon icon="mdi-chevron-left" size="x-large" color="white" />
        </div>
        <div class="newGames-swiper-button-next pa-2 transition cursor-pointer">
          <v-icon icon="mdi-chevron-right" size="x-large" color="white" />
        </div>
      </div>
    </v-col>

    <v-col cols="12">
      <swiper
        :modules="[SwiperFreeMode, SwiperAutoplay, SwiperNavigation]"
        :freeMode="true"
        :grab-cursor="true"
        :navigation="{
          prevEl: '.newGames-swiper-button-prev',
          nextEl: '.newGames-swiper-button-next',
        }"
        :loop="true"
        :autoplay="{
          delay: 3250,
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
        <SwiperSlide
          class="swiper-slide game-wrapper"
          v-for="item of gameResults"
          :key="item?.id"
          @click="
            router.push({
              path: `/allgames/${item.name}`,
              query: { game: JSON.stringify(item) },
            })
          "
        >
          <v-img
            class="image-game transition rounded-xl transition cursor-pointer"
            :src="item?.background_image"
            height="350"
            cover
          />
          <div class="content-game pa-3 rounded-lg">
            <h3 class="text-subtitle-2 text-white text-xl-subtitle-1">{{ item.name }}</h3>
          </div>
        </SwiperSlide>
      </swiper>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "single-game",
});

const isLoading = ref(false);
const isAnim = ref(false);
const router = useRouter();
const isSmLoading = ref(false);
const isSmLoading2 = ref(false);
const api_key = useRuntimeConfig().app.apiKey;
const models = ref({
  primaryGame: "",
  secondaryGame: "",
});
const primaryGame = ref({
  item: null,
  img: null,
});
const secondaryGame = ref({
  item: null,
  img: null,
});
const gamesFoundPrimary = ref<any[]>([]);
const gamesFoundSecondary = ref<any[]>([]);
const gameResults = ref<any[]>([]);

const searchGame = async () => {
  try {
    if (models.value.primaryGame.length > 2) {
      isSmLoading.value = true;
      const data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          search: models.value.primaryGame,
        },
      });
      gamesFoundPrimary.value = data?.results;
    } else {
      gamesFoundPrimary.value = [];
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isSmLoading.value = false;
  }
};

const searchGame2 = async () => {
  try {
    if (models.value.secondaryGame.length > 2) {
      isSmLoading2.value = true;
      const data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          search: models.value.secondaryGame,
        },
      });
      gamesFoundSecondary.value = data?.results;
    } else {
      gamesFoundSecondary.value = [];
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isSmLoading2.value = false;
  }
};

const setPrimaryGame = (item: any) => {
  isSmLoading.value = false;
  primaryGame.value.item = item;

  gamesFoundPrimary.value = [];
  models.value.primaryGame = "";
};

const setSecondaryGame = (item: any) => {
  isSmLoading2.value = false;
  secondaryGame.value.item = item;

  gamesFoundSecondary.value = [];
  models.value.secondaryGame = "";
};

const goToGame1 = () => {
  console.log(primaryGame.value.item);
};
const goToGame2 = () => {
  console.log(secondaryGame.value.item);
};

const findGamesWithCommonTags = async () => {
  const primaryTags = primaryGame.value.item?.tags.map((tag: any) => tag.slug) || [];
  const secondaryTags = secondaryGame.value.item?.tags.map((tag: any) => tag.slug) || [];
  const primaryGenres = primaryGame.value.item?.genres.map((genre: any) => genre.slug) || [];
  const secondaryGenres = secondaryGame.value.item?.genres.map((genre: any) => genre.slug) || [];

  // Ortak tag'leri bulalım
  const commonTags = primaryTags.filter((tag: string) => secondaryTags.includes(tag));
  const commonGenres = primaryGenres.filter((genre: string) => secondaryGenres.includes(genre));

  isAnim.value = true;

  try {
    let data;

    if (commonTags.length >= 2) {
      // En az iki ortak tag'e göre oyun araması
      data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          tags: commonTags.join(","),
          page_size: 20,
        },
      });
    } else if (commonTags.length === 1) {
      // Bir ortak tag'e göre oyun araması
      data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          tags: commonTags[0],
          page_size: 20,
        },
      });
    } else if (commonGenres.length > 0) {
      // Ortak oyun türüne göre oyun araması
      data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          genres: commonGenres.join(","),
          page_size: 20,
        },
      });
    } else {
      // Rastgele oyun araması
      data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          page_size: 20,
          ordering: "-added", // Yeni eklenen oyunları getir
        },
      });
    }

    // Sonuçları `gameResults` dizisine aktaralım
    gameResults.value = data.results || [];

    // Eğer hiçbir oyun bulunamadıysa, kullanıcıya bilgi verelim
    if (gameResults.value.length === 0) {
      console.log("Aramanızla eşleşen oyun bulunamadı.");
    }
  } catch (error: any) {
    console.log("API Error: ", error.message);
  } finally {
    isAnim.value = false;
  }
};


const clear = () => {
  primaryGame.value.item = null;
  secondaryGame.value.item = null;
  gameResults.value = [];
};

watch(
  [() => primaryGame.value.item, () => secondaryGame.value.item],
  ([newPrimary, newSecondary]) => {
    if (newPrimary && newSecondary) {
      findGamesWithCommonTags(); // İki item de doluysa fonksiyonu çalıştır
    }
  }
);
</script>

<style scoped>
@import url(/assets/css/main.css);

.main-container1,
.main-container2 {
  position: relative;
}
.back-btn:hover {
  color: #000 !important;
}
.smLoadingBar,
.smLoadingBar2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.search-results,
.search-results2 {
  position: absolute;
  width: 100%;
  z-index: 999;
  left: 0;
}
.search-wrapper,
.search-wrapper2 {
  background-color: #1a2537;
  overflow-y: scroll;
  height: 30rem !important;
  scrollbar-width: thin;
  scrollbar-color: #1a2537 #f0e8e8;
  scroll-behavior: smooth;
}
.item-image:hover {
  overflow: hidden;
  filter: brightness(0.7);
  scale: 1.05;
}
.item-image2:hover {
  overflow: hidden;
  filter: brightness(0.7);
  scale: 1.05;
}
.game {
  background-color: rgba(255, 255, 255, 0.2);
}
.game-image {
  width: 5rem !important;
  height: 100% !important;
}
.game:hover .game-title {
  color: #00e5ff;
}
.game:hover .game-genre {
  color: #00e5ff;
}
.game:hover .game-date {
  color: #00e5ff;
}

.swiper-slide {
  position: relative;
}
.content-game {
  background: rgba(0, 162, 255, 0.3);
  position: absolute;
  bottom: 5%;
  left: 3%;
  z-index: 99;
}
.custom-swiper-button-prev {
  left: 1%;
}
.custom-swiper-button-next {
  right: 1%;
}
.custom-swiper-button-prev:hover {
  background-color: rgba(0, 204, 255, 0.5);
}
.custom-swiper-button-next:hover {
  background-color: rgba(0, 204, 255, 0.5);
}
.newGames-swiper-button-prev,
.newGames-swiper-button-next {
  border-radius: 50%;
  background-color: rgba(0, 204, 255, 0.3);
}
.newGames-swiper-button-prev:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.newGames-swiper-button-next:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.content-wrapper:hover .right-icon {
  margin-left: 0.5rem;
}
.game-wrapper:hover .image-game {
  transform: scale(1.02);
  filter: brightness(0.5);
}

.anim-img {
  animation: rotate360 2s linear infinite;
}

@keyframes rotate360 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
