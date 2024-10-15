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

  <v-row class="pa-0 pa-sm-6 pa-md-9 pa-lg-12 pa-xl-15">
    <v-col cols="4">
      <v-card class="rounded-lg pa-5">
        <v-card-text>Your Game</v-card-text>
      </v-card>
      <v-text-field
        type="text"
        variant="outlined"
        color="cyan"
        label="Primary Game"
        placeholder="Elden Ring"
        rounded="lg"
      />
    </v-col>

    <v-col cols="4" class="d-flex flex-column justify-center align-center ga-5">
      <v-icon icon="mdi-plus" size="x-large" color="white" />
      <span>or try a</span>
      <v-btn class="rounded-lg transition" variant="outlined">random game</v-btn>
    </v-col>

    <v-col cols="4">
      <v-card class="rounded-lg pa-5">
        <v-card-text>Him Game</v-card-text>
      </v-card>
      <v-text-field
        type="text"
        variant="outlined"
        color="cyan"
        label="Secondary Game"
        placeholder="Lies of P"
        rounded="lg"
      />
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
definePageMeta({
  layout: "single-game",
});

const isLoading = ref(false);
const router = useRouter();
const models = ref({
  primaryGame: null,
  secondaryGame: null,
});
</script>
<style scoped>
@import url(/assets/css/main.css);
</style>
