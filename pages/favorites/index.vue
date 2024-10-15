<template>
  <Loading v-if="isLoading" />

  <v-row v-if="!isLoading" class="mt-5">
    <v-col cols="12" class="d-flex flex-column">
      <h3 class="text-h5 text-md-h3">Favorites</h3>
      <hr class="w-100 w-md-25 mt-2 mb-5" color="cyan" />
    </v-col>
  </v-row>

  <v-row v-if="!isLoading && favoriteGames.length > 0">
    <v-col
      @click="
        router.push({
          path: `/allgames/${item.name}`,
          query: { game: JSON.stringify(item) },
        })
      "
      class="game-wrapper cursor-pointer"
      v-for="(item, index) of favoriteGames"
      :key="item.id"
      cols="12"
      sm="6"
      lg="3"
    >
      <img
        height="250"
        width="100%"
        :src="item.background_image"
        class="image d-flex d-lg-none cursor-pointer transition rounded-lg transition"
      />
      <img
        height="275"
        width="100%"
        :src="item.background_image"
        class="image d-none d-lg-flex d-xl-none cursor-pointer transition rounded-lg transition"
      />
      <img
        height="350"
        width="100%"
        :src="item.background_image"
        class="image d-none d-xl-flex cursor-pointer transition rounded-lg transition"
      />
      <v-icon
        @click.stop="removeFromFavorite(item)"
        class="icon d-none pa-5 rounded-xl cursor-pointer"
        icon="mdi-delete"
      />

      <span v-if="item.metacritic" class="metacritic d-none pa-2 rounded-lg">{{
        item?.metacritic
      }}</span>

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

  <v-row v-if="!isLoading && favoriteGames.length == 0">
    <v-col cols="12">
      <h3 class="text-h5 text-md-h3">You haven't favorite games yet!</h3>
    </v-col>
  </v-row>

  <v-snackbar
    v-if="!isLoading"
    v-model="isInfo"
    :color="info.state === 'success' ? 'success' : 'error'"
    timeout="1500"
    >{{ info.msg }}</v-snackbar
  >
</template>
<script lang="ts" setup>
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

useHead({
  title: "GKGames - Favorites",
});
definePageMeta({
  middleware: ["auth"],
});

const isLoading = ref(true);
const favoriteGames = ref<any[]>([]);
const router = useRouter();
const auth = getAuth();
const db = getFirestore();
const colRef = collection(db, "favorites");
const isInfo = ref(false);
const info = ref({
  msg: "",
  state: "",
});

const getFavoriteGames = async () => {
  try {
    isLoading.value = true;
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.log("Kullanıcı kimliği bulunamadı");
      return;
    }

    const q = query(colRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    favoriteGames.value = querySnapshot.docs.map((doc) => doc.data().item);
  } catch (error: any) {
    console.log("Hata: ", error.message);
  } finally {
    isLoading.value = false;
  }
};

const removeFromFavorite = async (item: any) => {
  try {
    isLoading.value = true;
    const userId = auth.currentUser?.uid;

    if (!userId) {
      console.log("Kullanıcı kimliği bulunamadı");
      return;
    }

    const q = query(
      colRef,
      where("userId", "==", userId),
      where("item.id", "==", item.id)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      try {
        isLoading.value = true;
        const docSnapshot = querySnapshot.docs[0];
        await deleteDoc(docSnapshot.ref);

        favoriteGames.value = favoriteGames.value.filter(
          (game: any) => game.id !== item.id
        );
        info.value.msg = "This game deleted from your favorite list";
        info.value.state = "error";
        isInfo.value = true;
      } catch (error: any) {
        console.log(error.message);
      } finally {
        isLoading.value = false;
      }
    }
  } catch (error: any) {
    console.log("Hata: ", error.message);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await nextTick();
  isLoading.value = false;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      getFavoriteGames();
    }
  });
});
</script>
<style scoped>
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
</style>
