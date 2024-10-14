<template>
  <Loading v-if="isLoading" />
  <v-row
    class="d-flex justify-space-between align-start mt-2 mt-sm-0 pa-3"
    v-if="!isLoading"
  >
    <div class="content">
      <h3 class="text-subtitle-1 text-lg-h3">{{ route.query.name }} Games</h3>
      <hr class="mt-2 mb-10 w-100" color="#0AE6FF" />
    </div>
    <v-btn
      class="back-btn d-none d-sm-flex rounded-lg transition text-white"
      color="cyan"
      size="x-large"
      @click="router.replace('/browse')"
      prepend-icon="mdi-arrow-left"
      text="Back"
    />
    <v-btn
      class="back-btn d-flex d-sm-none rounded-lg transition text-white"
      color="cyan"
      @click="router.replace('/browse')"
      prepend-icon="mdi-arrow-left"
      text="Back"
      size="small"
    />
  </v-row>
  <v-row v-if="!isLoading">
    <v-col
      @click="
        router.push({
          path: `/allgames/${item.name}`,
          query: { game: JSON.stringify(item) },
        })
      "
      @mousemove="checkIfFavorite(item)"
      class="game-wrapper cursor-pointer"
      v-for="(item, index) of gamesList?.results"
      :key="item.id"
      cols="12"
      sm="6"
      lg="3"
    >
      <img
        height="250"
        width="100%"
        :src="item.background_image"
        class="image cursor-pointer transition rounded-lg transition d-flex d-lg-none"
      />
      <img
        height="275"
        width="100%"
        :src="item.background_image"
        class="image cursor-pointer transition rounded-lg transition d-none d-lg-flex d-xl-none"
      />
      <img
        height="350"
        width="100%"
        :src="item.background_image"
        class="image cursor-pointer transition rounded-lg transition d-none d-xl-flex"
      />
      <v-icon
        @click.stop="handleFavorite(item)"
        class="icon d-none pa-5 rounded-xl cursor-pointer"
        :icon="isAlreadyFavorite ? 'mdi-delete' : 'mdi-heart'"
      />
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
            {{ item?.released?.substring(0, 4) }}
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

  <v-row v-if="!isLoading" class="mt-15 flex justify-center align-center ga-3">
    <v-btn
      class="actions-btn transition rounded-xl text-white"
      color="cyan"
      v-if="previousPageUrl"
      @click="getAllGamesForPage(previousPageUrl)"
      >prev page</v-btn
    >
    <v-btn
      class="actions-btn transition rounded-xl text-white"
      color="cyan"
      v-if="nextPageUrl"
      @click="getAllGamesForPage(nextPageUrl)"
      >next page</v-btn
    >
  </v-row>

  <v-snackbar
    v-model="isInfo"
    :color="info.state === 'success' ? 'success' : 'error'"
    timeout="1500"
    >{{ info.msg }}</v-snackbar
  >
</template>

<script lang="ts" setup>
import {
  getFirestore,
  query,
  collection,
  where,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

definePageMeta({
  layout: "single-game",
});

const route = useRoute();
const router = useRouter();
const isLoading = ref(false);
const previousPageUrl = ref(null);
const nextPageUrl = ref(null);
const gamesList = ref(null);

const db = getFirestore();
const auth = getAuth();
const colRef = collection(db, "favorites");
const isAlreadyFavorite = ref(false);
const isInfo = ref(false);
const info = ref({
  msg: "",
  state: "",
});

const getGenres = async () => {
  try {
    isLoading.value = true;
    const data = await $fetch(route.query.endPoint as string);
    previousPageUrl.value = data?.previous;
    nextPageUrl.value = data?.next;
    gamesList.value = data;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const getAllGamesForPage = async (page: any) => {
  try {
    isLoading.value = true;
    const data = await $fetch(page);
    previousPageUrl.value = data?.previous;
    nextPageUrl.value = data?.next;
    gamesList.value = data;
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isLoading.value = false;
  }
};

const checkIfFavorite = async (item: any) => {
  const userId = auth.currentUser?.uid;
  if (!userId) return;

  const q = query(colRef, where("userId", "==", userId), where("item.id", "==", item.id));
  const querySnapshot = await getDocs(q);

  isAlreadyFavorite.value = !querySnapshot.empty;
};

const handleFavorite = async (item: any) => {
  try {
    const userId = auth.currentUser?.uid;
    const q = query(
      colRef,
      where("userId", "==", userId),
      where("item.id", "==", item.id)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      await addDoc(colRef, {
        userId: userId,
        item: item,
      });

      info.value.msg = "This item has been added to your favorite list";
      info.value.state = "success";
      isInfo.value = true;
    } else {
      querySnapshot.forEach(async (docSnapshot) => {
        try {
          await deleteDoc(doc(colRef, docSnapshot.id));
        } catch (deleteError) {
          console.error("Error deleting document: ", deleteError);
        }
      });
      info.value.msg = "This item has been removed from your favorite list";
      info.value.state = "error";
      isInfo.value = true;
    }
  } catch (error) {
    console.error("Error handling favorite: ", error);
  }
};
onMounted(async () => {
  await nextTick();
  getGenres();
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
  filter: brightness(0.5);
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

.back-btn:hover {
  color: #000 !important;
}
.actions-btn:hover {
  color: #000 !important;
}
</style>
