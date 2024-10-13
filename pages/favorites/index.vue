<template>
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

  <v-row v-if="favoriteGames.length == 0">
    <v-col cols="12">
      <h3 class="text-h5 text-md-h3">You haven't favorite games yet!</h3>
    </v-col>
  </v-row>
</template>
<script lang="ts" setup>
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  query,
  collection,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const isLoading = ref(false);
const favoriteGames = ref([]);
const router = useRouter();
const auth = getAuth();
const db = getFirestore();
const colRef = collection(db, "favorites");

const getFavoriteGames = async () => {
  try {
    isLoading.value = true; // Yükleme durumu başlatılıyor
    let userId = auth.currentUser?.uid; // Kullanıcı kimliği alınıyor

    // Eğer kullanıcı giriş yapmamışsa işlemi durdur
    if (!userId) {
      console.log("Kullanıcı kimliği bulunamadı");
      return;
    }

    // Kullanıcının favori oyunlarını sorgula
    const q = query(colRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    // Favori oyunları diziye aktarma
    favoriteGames.value = querySnapshot.docs.map((doc) => doc.data().item);
  } catch (error: any) {
    console.log("Hata: ", error.message);
  } finally {
    isLoading.value = false; // Yükleme durumu bitiriliyor
  }
};

const removeFromFavorite = async (item: any) => {
  try {
    isLoading.value = true; // Yükleme durumu başlatılıyor
    const userId = auth.currentUser?.uid; // Kullanıcı kimliği alınıyor

    // Eğer kullanıcı giriş yapmamışsa işlemi durdur
    if (!userId) {
      console.log("Kullanıcı kimliği bulunamadı");
      return;
    }

    // Silinecek belgeyi sorgula
    const q = query(
      colRef,
      where("userId", "==", userId),
      where("item.id", "==", item.id)
    );
    const querySnapshot = await getDocs(q);

    // Eğer belge varsa sil
    if (!querySnapshot.empty) {
      try {
        isLoading.value = true;
        const docSnapshot = querySnapshot.docs[0]; // İlk belgeyi al
        await deleteDoc(docSnapshot.ref); // Firestore'dan belgeyi sil

        // Favori oyunları dizisinden de çıkar
        favoriteGames.value = favoriteGames.value.filter(
          (game: any) => game.id !== item.id
        );
      } catch (error: any) {
        console.log(error.message);
      } finally {
        isLoading.value = false;
      }
    }
  } catch (error: any) {
    console.log("Hata: ", error.message);
  } finally {
    isLoading.value = false; // Yükleme durumu bitiriliyor
  }
};

onMounted(() => {
  getFavoriteGames();
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
