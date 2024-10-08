<template>
  <Loading v-if="isLoading" />

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
          delay: 3000,
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
            class="image rounded-lg d-none d-md-flex"
            :src="
              item.urlToImage
                ? item.urlToImage
                : 'https://media.istockphoto.com/id/1334436084/tr/foto%C4%9Fraf/top-down-view-of-colorful-illuminated-gaming-accessories-laying-on-table.jpg?s=612x612&w=0&k=20&c=RefVtIFV7L-nNysTPo3JulhNcw2eAmm6sF0kARa6D9o='
            "
            height="700"
            cover
          />
          <v-img
            class="image rounded-lg d-flex d-md-none"
            :src="
              item.urlToImage
                ? item.urlToImage
                : 'https://media.istockphoto.com/id/1334436084/tr/foto%C4%9Fraf/top-down-view-of-colorful-illuminated-gaming-accessories-laying-on-table.jpg?s=612x612&w=0&k=20&c=RefVtIFV7L-nNysTPo3JulhNcw2eAmm6sF0kARa6D9o='
            "
            height="500"
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
</template>

<script lang="ts" setup>
import { Mousewheel, Keyboard } from "swiper/modules";

const isLoading = ref(false);
const newsArr = ref([]);
const randomNews = ref([]);
const api_key = useRuntimeConfig().app.apiKeyNews;

const selectRandomNews = () => {
  if (newsArr.value.length > 0) {
    const shuffled = newsArr.value.sort(() => 0.5 - Math.random());
    randomNews.value = shuffled.slice(0, 10);
  }
};

const getNews = async () => {
  try {
    isLoading.value = true;
    const data = await $fetch(
      `https://newsapi.org/v2/everything?q=gaming&apiKey=${api_key}`
    );
    newsArr.value = data?.articles;

    selectRandomNews();
    console.log(randomNews.value);
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const openToNews = (item) => {
  const url = item.url;
  window.open(url, "_blank");
};

const truncateText = (text: string, length: number) => {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + "...";
};

onMounted(async () => {
  await nextTick();
  getNews();
});
</script>

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
</style>
