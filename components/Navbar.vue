<template>
  <v-app-bar
    class="navbar-top bg-transparent px-3 py-2 px-sm-6 px-md-9 px-lg-12 px-xl-15"
    elevation="10"
  >
    <template v-slot:prepend>
      <div
        @click="router.replace('/')"
        class="logo cursor-pointer d-flex justify-center align-center ga-2"
      >
        <v-img :src="logo" width="50"></v-img>
        <span class="text-h5 text-md-h4 d-none d-sm-flex"><strong>GK</strong>Games</span>
      </div>
      <div></div>
    </template>
    <template v-slot:append>
      <div class="actions d-flex justify-center align-center ga-2 ga-sm-4">
        <v-icon
          @click="_store.changeTheme"
          class="transition theme-icon mx-0 mx-sm-3"
          size="large"
          :icon="_store.theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        />
        <v-btn variant="outlined" class="transition rounded-lg login-btn" text="Login" />
        <v-btn
          variant="outlined"
          class="transition rounded-lg signup-btn"
          text="Signup"
        />
      </div>
    </template>
  </v-app-bar>

  <v-row class="navbar-search d-flex justify-space-between align-center mt-5 mt-sm-0">
    <v-form class="form w-75 w-md-50 mx-auto">
      <v-text-field
        v-model="models.name"
        @input="searchGame"
        color="#00e5ff"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="xl"
        placeholder="Search Game"
      />
      <div class="search-results rounded-lg pa-3">
        <v-progress-circular
          v-if="isSmLoading"
          class="smLoadingBar"
          :size="30"
          :width="3"
          color="blue-lighten-1"
          indeterminate
        ></v-progress-circular>
        <div
          v-if="searchResults.length > 0"
          class="search-wrapper d-flex flex-column ga-1 ga-md-2 rounded-lg pa-3 pa-md-5"
        >
          <div
            @click="openGame(item)"
            v-for="item of searchResults"
            :key="item?.id"
            class="game text-white rounded-lg pa-2 pa-md-5 cursor-pointer transition d-flex justify-start align-center ga-2"
          >
            <img class="rounded-lg game-image" :src="item?.background_image" cover />
            <div class="context d-flex flex-column">
              <span class="game-title text-subtitle-1">{{ item.name }}</span>
              <div class="d-flex">
                <span class="game-genre text-subtitle-2" v-for="genre of item?.genres">
                  {{ genre.name + " " }}&nbsp;
                </span>
              </div>
              <span class="game-date d-inline text-caption">
                {{ item?.released.substring(0, 4) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-form>
    <v-row
      class="d-flex justify-center justify-sm-end align-center ga-1 ga-md-3 my-2 my-sm-0"
    >
      <span
        @click="router.replace('/')"
        :class="
          !route.fullPath.includes('brows') && !route.fullPath.includes('allgames')
            ? 'active-link'
            : ''
        "
        class="link transition rounded cursor-pointer pa-1 pa-sm-2 text-subtitle-1"
        >Discover</span
      >
      <span
        @click="router.replace('/allgames')"
        :class="route.fullPath.includes('allgames') ? 'active-link' : ''"
        class="link transition rounded cursor-pointer pa-1 pa-sm-2 text-subtitle-1"
        >All Games</span
      >
      <span
        @click="router.replace('/browse')"
        :class="route.fullPath.includes('browse') ? 'active-link' : ''"
        class="link transition rounded cursor-pointer pa-1 pa-sm-2 text-subtitle-1"
        >Browse</span
      >
    </v-row>
  </v-row>
</template>

<script lang="ts" setup>
import logo from "~/assets/img/gameLogo.png";
import store from "~/store/store";

const _store = store();
const router = useRouter();
const route = useRoute();
const searchResults = ref([]);

const models = ref({
  name: "",
});
const isSmLoading = ref(false);
const api_key = useRuntimeConfig().app.apiKey;

const searchGame = async () => {
  try {
    if (models.value.name.length > 2) {
      isSmLoading.value = true;
      const { data } = await useFetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          search: models.value.name,
        },
      });
      searchResults.value = data.value?.results;
      console.log(searchResults.value);
    } else {
      searchResults.value = [];
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isSmLoading.value = false;
  }
};

const openGame = (item: any) => {
  router.push({
    path: `/allgames/${item.name}`,
    query: { game: JSON.stringify(item) },
  });
  isSmLoading.value = false;
  searchResults.value = [];
  models.value.name = "";
};
</script>

<style scoped>
@import url(/assets/css/main.css);
.form {
  position: relative;
}
.smLoadingBar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.search-results {
  position: absolute;
  width: 100%;
  z-index: 999;
  left: 0;
}
.search-wrapper {
  background-color: #1a2537;
  overflow-y: scroll;
  height: 30rem !important;
  scrollbar-width: thin;
  scrollbar-color: #1a2537 #f0e8e8;
  scroll-behavior: smooth;
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
.login-btn {
  color: #546e7a;
  border-color: #546e7a;
}
.login-btn:hover {
  background-color: #546e7a;
  color: #fff;
}
.signup-btn {
  color: #00e5ff;
  border-color: #00e5ff;
}
.signup-btn:hover {
  background-color: #00e5ff;
  color: #fff;
}
.theme-icon:hover {
  color: #00e5ff;
}
.link:hover {
  background-color: #78909c;
  color: #fff;
}

.active-link {
  background-color: #0ae6ff !important;
  color: #fff !important;
}
</style>
