<script lang="ts" setup>
import store from "./store/store";

const _store = store();
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
