<template>
  <Loading v-if="isLoading" />
  <v-row v-if="!isLoading">
    <v-col
      class="game-wrapper"
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
  <v-row class="mt-15 flex justify-center align-center ga-3">
    <v-btn v-if="previousPageUrl" @click="getAllGames(previousPageUrl)">prev page</v-btn>
    <v-btn v-if="nextPageUrl" @click="getAllGames(nextPageUrl)">next page</v-btn>
  </v-row>
</template>
<script lang="ts" setup>
const isLoading = ref(false);
const api_key = useRuntimeConfig().app.apiKey;
const initialUrl = `https://api.rawg.io/api/games?key=${api_key}`;
const previousPageUrl = ref(null);
const nextPageUrl = ref(null);
const gamesList = ref([]);

const getAllGames = async (url: string) => {
  try {
    isLoading.value = true;
    const data = await $fetch(url);
    gamesList.value = data?.results;

    nextPageUrl.value = data?.next;
    previousPageUrl.value = data?.previous;
    console.log(gamesList.value);
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  getAllGames(initialUrl);
});
</script>
<style scoped>
@import url(/assets/css/main.css);

.game-wrapper {
  position: relative;
}
.image {
  position: relative;
  overflow: hidden;
}
.game-wrapper:hover .image {
  transform: scale(1.02);
  filter: brightness(1.2);
}
.game-wrapper:hover .icon {
  display: flex !important;
}
.game-wrapper:hover .metacritic {
  display: flex !important;
}
.metacritic {
  position: absolute;
  top: 5%;
  left: 5%;
  background-color: #0ae6ff;
  color: #fff;
}
.icon {
  position: absolute;
  top: 5%;
  right: 5%;
  background-color: rgba(0, 0, 0, 0.3);
  color: #fff;
}
.icon:hover {
  background-color: red;
  color: #fff;
}
</style>
