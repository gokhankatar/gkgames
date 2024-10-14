<script lang="ts" setup>
import store from "./store/store";
import ogImg from "~/assets/screenshots/ogImg.png";

const _store = store();
const { $firebase } = useNuxtApp();

useSeoMeta({
  title:
    "GKGames - A web application from Gksoftware where you can follow thousands of games and game news.",
  ogTitle:
    "GKGames - A web application from Gksoftware where you can follow thousands of games and game news.",
  description:
    "GKGames - It is a web application belonging to Gksoftware where you can find thousands of games, add them to your favorites list and follow them, as well as see game news and find games thanks to artificial intelligence.",
  ogDescription:
    "GKGames - It is a web application belonging to Gksoftware where you can find thousands of games, add them to your favorites list and follow them, as well as see game news and find games thanks to artificial intelligence.",
  ogImage: ogImg,
  twitterCard: "summary_large_image",
  twitterImage: ogImg,
});
</script>

<template>
  <v-app :theme="_store.theme">
    <v-main>
      <v-container class="pa-3 pa-sm-6 pa-md-9 pa-lg-12 pa-xl-15">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
@import url(/assets/css/main.css);
</style>
