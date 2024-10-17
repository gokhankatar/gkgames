<script lang="ts" setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import imgNull from "~/assets/img/imgNull.jpg";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";

definePageMeta({
  layout: "single-game",
});

const router = useRouter();
const route = useRoute();
const isLoading = ref(false);
const requirements = ref(false);
const isAlreadyFavorite = ref(false);
const isInfo = ref(false);
const info = ref({
  msg: "",
  state: "",
});
const auth = getAuth();
const db = getFirestore();
const colRef = collection(db, "favorites");

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

useHead({
  title: `GKGames - ${game.value?.name}`,
});

const handleReq = async () => {
  await game.value.platforms.forEach((g: any) => {
    if (g.requirements_en) {
      requirements.value = true;
    }
  });
};

const thumbsSwiper = ref(null);

const setThumbsSwiper = (swiper: any) => {
  thumbsSwiper.value = swiper;
};

const checkIfFavorite = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId || !game.value) return;

  const q = query(
    colRef,
    where("userId", "==", userId),
    where("item.id", "==", game.value.id)
  );
  const querySnapshot = await getDocs(q);

  isAlreadyFavorite.value = !querySnapshot.empty;
};

const handleFavorite = async () => {
  const userId = auth.currentUser?.uid;
  if (!userId || !game.value) {
    info.value.msg = "You should login";
    info.value.state = "error";
    isInfo.value = true;
  }

  const docRef = doc(colRef, `${userId}_${game.value.id}`);

  if (isAlreadyFavorite.value) {
    await deleteDoc(docRef);
    isAlreadyFavorite.value = false;
    info.value.msg = "This item has been removed from your favorite list";
    info.value.state = "error";
    isInfo.value = true;
  } else {
    await setDoc(docRef, {
      userId,
      item: game.value,
    });
    isAlreadyFavorite.value = true;
    info.value.msg = "This item has been added to your favorite list";
    info.value.state = "success";
    isInfo.value = true;
  }
};

onMounted(async () => {
  await nextTick();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      checkIfFavorite();
    }
  });
});
</script>

<template>
  <Loading v-if="isLoading" />
  <v-row
    v-if="!isLoading"
    class="d-flex justify-space-between align-start mt-2 mt-sm-0 pa-3"
  >
    <div class="content-title">
      <h3 class="text-subtitle-1 font-weight-bold text-lg-h3">{{ game.name }}</h3>
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
  <v-row v-if="!isLoading">
    <v-col cols="12" md="12" lg="6">
      <!-- Main Slider -->
      <swiper
        :modules="[SwiperFreeMode, SwiperAutoplay, SwiperNavigation, SwiperThumbs]"
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
        :thumbs="{
          swiper: thumbsSwiper,
        }"
        class="mySwiper"
      >
        <div
          class="custom-swiper-button-prev rounded-lg d-none pa-1 pa-md-5 cursor-pointer"
        >
          <v-icon icon="mdi-arrow-left" size="x-large" />
        </div>
        <div
          class="custom-swiper-button-next rounded-lg d-none pa-1 pa-md-5 cursor-pointer"
        >
          <v-icon icon="mdi-arrow-right" size="x-large" />
        </div>
        <swiper-slide
          v-if="game.short_screenshots.length > 0"
          class="mySwiper"
          v-for="(slide, index) in game.short_screenshots"
          :key="index"
        >
          <v-img
            height="50vh"
            class="d-none d-sm-flex rounded-lg"
            :src="slide.image"
            cover
          />
          <v-img
            height="40vh"
            class="d-flex d-sm-none rounded-lg"
            :src="slide.image"
            cover
          />
        </swiper-slide>
        <swiper-slide class="mySwiper" v-if="game.short_screenshots.length == 0">
          <v-img height="50vh" class="d-none d-sm-flex rounded-lg" :src="imgNull" cover />
          <v-img height="40vh" class="d-flex d-sm-none rounded-lg" :src="imgNull" cover />
        </swiper-slide>
      </swiper>

      <!-- Thumbnail Slider -->
      <swiper
        ref="thumbsSwiperRef"
        :modules="[SwiperFreeMode, SwiperNavigation, SwiperThumbs]"
        :slidesPerView="3"
        :freeMode="true"
        :watchSlidesProgress="true"
        :space-between="5"
        @swiper="setThumbsSwiper"
      >
        <swiper-slide
          class="mySwiper2 mt-2 mt-lg-3 mt-xl-4 cursor-pointer"
          v-for="(slide, index) in game.short_screenshots"
          :key="index"
        >
          <v-img
            height="150"
            class="d-none d-sm-flex rounded-lg"
            :src="slide.image"
            cover
          />
          <v-img
            height="100"
            class="d-flex d-sm-none rounded-lg"
            :src="slide.image"
            cover
          />
        </swiper-slide>
      </swiper>
    </v-col>

    <v-col cols="12" md="12" lg="5" class="d-flex flex-column ga-2">
      <!-- genres -->
      <div v-if="game.genres" class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Genres: </span>
        <span class="d-inline text-subtitle-1">
          {{ game?.genres.map((genre:any) => genre.name).join(", ") }}
        </span>
      </div>

      <!-- release -->
      <div v-if="game.released" class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Released: </span>
        <span class="d-inline text-subtitle-1">
          {{ game?.released?.substring(0, 4) }}
        </span>
      </div>

      <!-- metacritic -->
      <div v-if="game.metacritic" class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Metacritic: </span>
        <span class="d-inline text-subtitle-1">
          {{ game?.metacritic }}
        </span>
        <v-icon icon="mdi-trophy" />
      </div>

      <!-- stores -->
      <div v-if="game.stores" class="d-flex justify-start align-center ga-5">
        <span class="text-grey">Stores: </span>
        <a
          v-for="store of game?.stores"
          :href="`https://${store.store.domain}`"
          target="_blank"
          class="store-text d-inline transition text-subtitle-2 text-sm-subtitle-1"
        >
          {{ store.store.name }}
        </a>
      </div>

      <!-- platforms -->
      <div v-if="game.parent_platforms" class="d-flex justify-start align-center ga-5">
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

      <!-- tags -->
      <div v-if="game.tags" class="mt-5">
        <v-chip class="ma-1" v-for="tag of game.tags" :key="tag.id">{{
          tag.name
        }}</v-chip>
      </div>
      <v-btn
        @click="handleFavorite"
        :class="isAlreadyFavorite ? 'already-favorite' : ''"
        class="favorite-btn rounded-xl transition w-auto mt-3"
        :text="isAlreadyFavorite ? 'remove from favorites' : 'add to favorites'"
        :prepend-icon="isAlreadyFavorite ? 'mdi-delete' : 'mdi-heart'"
      />
    </v-col>
  </v-row>

  <v-responsive height="100" />

  <v-row v-if="requirements" class="d-flex flex-column justify-start align-start">
    <h3 class="text-h5 text-md-h4">System Requirements</h3>
    <hr color="#0AE6FF" class="mt-2 w-100 w-md-25" />
  </v-row>

  <v-row v-for="systemReq of game.platforms">
    <v-col v-if="requirements" cols="12" sm="6">
      <v-card
        height="250"
        v-if="systemReq?.requirements_en?.minimum"
        class="card-req px-5 py-2 rounded-lg"
      >
        <v-card-text v-html="systemReq.requirements_en.minimum"></v-card-text>
      </v-card>
    </v-col>
    <v-col v-if="requirements" cols="12" sm="6">
      <v-card
        height="250"
        v-if="systemReq?.requirements_en?.recommend"
        class="card-req px-5 py-2 rounded-lg"
      >
        <v-card-text v-html="systemReq.requirements_en.recommended"></v-card-text>
      </v-card>
    </v-col>
  </v-row>

  <v-snackbar
    v-model="isInfo"
    :color="info.state === 'success' ? 'success' : 'error'"
    timeout="1500"
    >{{ info.msg }}</v-snackbar
  >
</template>

<style scoped>
.card-req {
  overflow-y: auto;
}
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
.back-btn:hover {
  color: #000 !important;
}
.favorite-btn {
  border: 1px solid red;
  background-color: transparent;
  color: red;
}
.favorite-btn:hover {
  background-color: red;
  color: #fff;
}
.already-favorite {
  border-color: #ef5350 !important;
  color: #ef5350 !important;
}
.already-favorite:hover {
  background-color: #ef5350 !important;
  border-color: #ef5350 !important;
  color: #fff !important;
}
</style>
