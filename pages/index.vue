<script lang="ts" setup>
import { Mousewheel } from "swiper/modules";
import imgNull from "~/assets/img/imgNull.jpg";

const isLoading = ref(true);
const router = useRouter();
const newsArr = ref<any[]>([]);
const bestGamesArr = ref<any[]>([]);
const popularGamesArr = ref<any[]>([]);
const randomNews = ref<any[]>([]);
const newGames = ref<any[]>([]);
const api_key = useRuntimeConfig().app.apiKeyNews;
const apiKey = useRuntimeConfig().app.apiKey;

const selectRandomNews = (list: Ref<any[]>, num: number) => {
  if (list.value.length > 0) {
    const shuffled = list.value.sort(() => 0.5 - Math.random());
    randomNews.value = shuffled.slice(0, num);
  }
};

const getNews = async () => {
  try {
    isLoading.value = true;
    const data = await $fetch(
      `https://newsapi.org/v2/everything?q=gaming&apiKey=${api_key}`
    );
    newsArr.value = data?.articles ?? [];

    selectRandomNews(newsArr, 10);
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const openToNews = (item: any) => {
  const url = item.url;
  window.open(url, "_blank");
};

const getNewGames = async () => {
  try {
    isLoading.value = true;

    const currentDate = new Date().toISOString().slice(0, 10);
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1);
    const formattedEndDate = endDate.toISOString().slice(0, 10);

    const url = `https://api.rawg.io/api/games?key=${apiKey}&dates=${currentDate},${formattedEndDate}&ordering=released`;
    const data = await $fetch(url);

    newGames.value = data?.results?.filter((game: any) => {
      return !game.tags?.some((tag: any) => tag.name.toLowerCase() === "nudity");
    });
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const getBestGames = async () => {
  try {
    isLoading.value = true;
    const url = `https://api.rawg.io/api/games?key=${apiKey}&ordering=-metacritic`;
    const data = await $fetch(url);
    bestGamesArr.value = data?.results;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const getPopularGames = async () => {
  try {
    isLoading.value = true;
    const url = `https://api.rawg.io/api/games?ordering=-added&key=${apiKey}`;
    const data = await $fetch(url);
    popularGamesArr.value = data?.results;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const truncateText = (text: string, length: number) => {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
};

onMounted(async () => {
  await nextTick();
  isLoading.value = false;
  getNews();
  getNewGames();
  getBestGames();
  getPopularGames();
});
</script>

<template>
  <Loading v-if="isLoading" />

  <!-- game news slider -->
  <v-row v-if="!isLoading" class="my-5">
    <v-col cols="12">
      <swiper
        :modules="[
          SwiperFreeMode,
          SwiperKeyboard,
          SwiperPagination,
          SwiperNavigation,
          Mousewheel,
          SwiperAutoplay,
          SwiperNavigation,
        ]"
        :freeMode="true"
        :navigation="{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }"
        :slidesPerView="1"
        :keyboard="{
          enabled: true,
        }"
        :mousewheel="true"
        :pagination="{
          clickable: true,
        }"
        :loop="true"
        :space-between="10"
        :autoplay="{
          delay: 4500,
          disableOnInteraction: false,
        }"
        class="mySwiper"
      >
        <div class="custom-swiper-button-prev pa-5 transition cursor-pointer">
          <v-icon icon="mdi-arrow-left d-none d-sm-flex" size="x-large" color="white" />
          <v-icon icon="mdi-arrow-left d-flex d-sm-none" color="white" />
        </div>
        <div class="custom-swiper-button-next transition pa-5 cursor-pointer">
          <v-icon icon="mdi-arrow-right d-none d-sm-flex" size="x-large" color="white" />
          <v-icon icon="mdi-arrow-right d-flex d-sm-none" color="white" />
        </div>
        <swiper-slide v-for="item of randomNews" class="swiper-slide rounded-lg">
          <v-img
            class="image rounded-lg"
            :src="
              item.urlToImage
                ? item.urlToImage
                : 'https://media.istockphoto.com/id/1334436084/tr/foto%C4%9Fraf/top-down-view-of-colorful-illuminated-gaming-accessories-laying-on-table.jpg?s=612x612&w=0&k=20&c=RefVtIFV7L-nNysTPo3JulhNcw2eAmm6sF0kARa6D9o='
            "
            height="70vh"
            cover
          />
          <div
            class="content w-100 w-md-50 d-flex flex-column align-center align-md-start ga-2 ga-md-5"
          >
            <span
              class="title text-white text-subtitle-1 text-md-h4 text-center text-sm-start"
              >{{ item.title }}</span
            >
            <span
              class="desc text-white text-subtitle-2 text-md-subtitle-1 text-center text-sm-start d-none d-md-flex"
              >{{
                item.content ? truncateText(item.content, 200) : item.description
              }}</span
            >
            <span
              class="desc text-white text-subtitle-2 text-md-subtitle-1 text-center text-sm-start d-flex d-md-none"
              >{{
                item.content ? truncateText(item.content, 100) : item.description
              }}</span
            >
            <v-btn
              @click="openToNews(item)"
              class="rounded-lg transition btn-news text-white"
              size="large"
              variant="text"
              text="See News"
              prepend-icon="mdi-eye"
            />
          </div>
          <div class="control d-none d-md-flex justify-center align-center ga-3">
            <v-icon size="x-large" color="white" icon="mdi-mouse" />
            <span class="text-h5">/</span>
            <v-icon size="x-large" color="white" icon="mdi-keyboard" />
          </div>
        </swiper-slide>
      </swiper>
    </v-col>
  </v-row>

  <!-- new games slider -->
  <v-row v-if="!isLoading" class="mt-15">
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div class="content-wrapper d-flex justify-center align-center ga-2 cursor-pointer">
        <h3 class="font-weight-bold text-subtitle-1 text-sm-h5">Discover New Games</h3>
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
          v-for="item of newGames"
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
            :src="item.background_image ? item.background_image : imgNull"
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

  <!-- best games slider -->
  <v-row v-if="!isLoading" class="mt-15">
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div class="content-wrapper d-flex justify-center align-center ga-2 cursor-pointer">
        <h3 class="font-weight-bold text-subtitle-1 text-sm-h5">Best Games</h3>
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
        <div class="bestGames-swiper-button-prev pa-2 transition cursor-pointer">
          <v-icon icon="mdi-chevron-left" size="x-large" color="white" />
        </div>
        <div class="bestGames-swiper-button-next pa-2 transition cursor-pointer">
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
          prevEl: '.bestGames-swiper-button-prev',
          nextEl: '.bestGames-swiper-button-next',
        }"
        :loop="true"
        :autoplay="{
          delay: 3850,
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
          @click="
            router.push({
              path: `/allgames/${item.name}`,
              query: { game: JSON.stringify(item) },
            })
          "
          class="swiper-slide game-wrapper"
          v-for="item of bestGamesArr"
          :key="item?.id"
        >
          <v-img
            class="image-game transition rounded-xl transition cursor-pointer"
            :src="item.background_image ? item.background_image : imgNull"
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

  <!-- popular games slider -->
  <v-row v-if="!isLoading" class="mt-15">
    <v-col cols="12" class="d-flex justify-space-between align-center">
      <div class="content-wrapper d-flex justify-center align-center ga-2 cursor-pointer">
        <h3 class="font-weight-bold text-subtitle-1 text-sm-h5">Popular Games</h3>
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
        <div class="popularGames-swiper-button-prev pa-2 transition cursor-pointer">
          <v-icon icon="mdi-chevron-left" size="x-large" color="white" />
        </div>
        <div class="popularGames-swiper-button-next pa-2 transition cursor-pointer">
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
          prevEl: '.popularGames-swiper-button-prev',
          nextEl: '.popularGames-swiper-button-next',
        }"
        :loop="true"
        :autoplay="{
          delay: 3500,
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
          @click="
            router.push({
              path: `/allgames/${item.name}`,
              query: { game: JSON.stringify(item) },
            })
          "
          class="swiper-slide game-wrapper"
          v-for="item of popularGamesArr"
          :key="item?.id"
        >
          <v-img
            class="image-game transition rounded-xl transition cursor-pointer"
            :src="item.background_image ? item.background_image : imgNull"
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

<style scoped>
@import url(/assets/css/main.css);
.btn-news {
  background-color: rgba(255, 255, 255, 0.1) !important;
}
.btn-news:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
}
.swiper-slide {
  position: relative;
}
.image {
  filter: brightness(0.5);
}
.content {
  position: absolute;
  bottom: 5%;
  left: 3%;
  z-index: 99;
}
.content-game {
  background: rgba(0, 162, 255, 0.3);
  position: absolute;
  bottom: 5%;
  left: 3%;
  z-index: 99;
}
.control {
  position: absolute;
  bottom: 2%;
  right: 3%;
  z-index: 99;
}
.custom-swiper-button-prev,
.custom-swiper-button-next {
  position: absolute;
  top: 50%;
  z-index: 99;
  transform: translateY(-50%);
  background-color: rgba(0, 204, 255, 0.3);
  border-radius: 50%;
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
.newGames-swiper-button-next,
.bestGames-swiper-button-prev,
.bestGames-swiper-button-next,
.popularGames-swiper-button-prev,
.popularGames-swiper-button-next {
  border-radius: 50%;
  background-color: rgba(0, 204, 255, 0.3);
}
.newGames-swiper-button-prev:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.newGames-swiper-button-next:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.bestGames-swiper-button-prev:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.bestGames-swiper-button-next:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.popularGames-swiper-button-prev:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.popularGames-swiper-button-next:hover {
  background-color: rgba(0, 204, 255, 0.7);
}
.content-wrapper:hover .right-icon {
  margin-left: 0.5rem;
}
.game-wrapper:hover .image-game {
  transform: scale(1.02);
  filter: brightness(0.5);
}
</style>
