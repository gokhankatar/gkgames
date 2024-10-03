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
    <v-form class="input w-75 w-md-50 mx-auto">
      <v-text-field
        color="#00e5ff"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="xl"
        placeholder="Search Game"
        clearable
      />
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
</script>
<style scoped>
@import url(/assets/css/main.css);

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
