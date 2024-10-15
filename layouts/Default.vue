<script lang="ts" setup>
const isLoading = ref(true);

onMounted(async () => {
  await nextTick();
  isLoading.value = false;
});
</script>
<template>
  <Loading v-if="isLoading" />
  <Navbar v-if="!isLoading" />
  <slot />
</template>
