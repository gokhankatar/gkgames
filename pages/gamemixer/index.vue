<template>
  <Loading v-if="isLoading" />
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

  <v-row class="main-container pa-0 pa-sm-6 pa-md-9 pa-lg-12 pa-xl-15">
    <v-col cols="5" class="main-container1">
      <v-card height="40vh" class="rounded-lg pa-5 d-flex justify-center align-center">
        <v-card-text class="text-center text-h5 text-md-h3">Game 1</v-card-text>
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
        ></v-progress-circular>

        <div
          v-if="gamesFoundPrimary.length > 0"
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

    <v-col cols="2" class="d-flex flex-column justify-center align-center ga-5">
      <img
        class="d-flex d-md-none"
        width="50"
        src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-28/512/1034_Add_new_plus_sign-512.png"
      />
      <img
        class="d-none d-sm-flex"
        width="150"
        src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-28/512/1034_Add_new_plus_sign-512.png"
      />
      <span class="text-caption text-sm-subtitle-1">or try a</span>
      <v-btn class="rounded-lg transition" variant="outlined" text="random" />
    </v-col>

    <v-col cols="5" class="main-container2">
      <v-card height="40vh" class="rounded-lg pa-5 d-flex justify-center align-center">
        <v-card-text class="text-center text-h5 text-md-h3">Game 2</v-card-text>
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
          v-if="isSmLoading"
          class="smLoadingBar2"
          :size="30"
          :width="3"
          color="blue-lighten-1"
          indeterminate
        ></v-progress-circular>

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
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "single-game",
});

const isLoading = ref(false);
const router = useRouter();
const isSmLoading = ref(false);
const api_key = useRuntimeConfig().app.apiKey;
const models = ref({
  primaryGame: "",
  secondaryGame: "",
});
const gamesFoundPrimary = ref<any[]>([]);
const gamesFoundSecondary = ref<any[]>([]);
const primaryGame = ref();
const secondaryGame = ref();

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
      isSmLoading.value = true;
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
    isSmLoading.value = false;
  }
};

const setPrimaryGame = (item: any) => {
  isSmLoading.value = false;
  gamesFoundPrimary.value = [];
  models.value.primaryGame = "";
};

const setSecondaryGame = (item: any) => {
  isSmLoading.value = false;
  gamesFoundSecondary.value = [];
  models.value.secondaryGame = "";
};
</script>
<style scoped>
@import url(/assets/css/main.css);

.main-container {
  overflow: hidden;
}

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
</style>
