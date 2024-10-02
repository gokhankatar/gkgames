<template>
  <v-app-bar class="navbar-top bg-transparent px-5 py-1" elevation="10">
    <template v-slot:prepend>
      <div
        @click="router.replace('/')"
        class="logo cursor-pointer d-flex justify-center align-center ga-2"
      >
        <v-img :src="logo" width="50"></v-img>
        <span class="text-h5 text-md-h4"><strong>GK</strong>Games</span>
      </div>
      <div></div>
    </template>
    <template v-slot:append>
      <div class="actions d-flex justify-center align-center ga-4">
        <v-icon
          @click="_store.changeTheme"
          class="transition mx-3"
          size="large"
          :class="_store.theme === 'light' ? 'theme-icon-light' : 'theme-icon-dark'"
          :icon="_store.theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        />
        <v-btn variant="tonal" class="transition rounded-lg login-btn" text="Login" />
        <v-btn
          variant="tonal"
          :color="_store.theme === 'light' ? 'blue-darken-3' : 'blue-lighten-1'"
          class="transition rounded-lg signup-btn"
          text="Signup"
        />
      </div>
    </template>
  </v-app-bar>

  <v-row class="navbar-search d-flex justify-start align-center ga-5">
    <v-form class="input w-50">
      <v-text-field
        :color="_store.theme === 'light' ? 'blue-darken-3' : 'blue-lighten-1'"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="xl"
        placeholder="Search Game"
      />
    </v-form>
    <span class="link transition rounded cursor-pointer pa-2 text-subtitle-1"
      >Discover</span
    >
    <span class="link transition rounded cursor-pointer pa-2 text-subtitle-1"
      >Browse</span
    >
    <span class="link transition rounded cursor-pointer pa-2 text-subtitle-1">News</span>
  </v-row>
</template>
<script lang="ts" setup>
import logo from "~/assets/img/gameLogo.png";
import store from "~/store/store";

const _store = store();
const router = useRouter();
</script>
<style scoped>
@import url(/assets/css/main.css);

.theme-icon-light:hover {
  color: #039be5;
}
.theme-icon-dark:hover {
  color: #00e5ff;
}
.link:hover {
  background-color: #78909c;
  color: #fff;
}
</style>
