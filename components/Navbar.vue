<script lang="ts" setup>
import logo from "~/assets/img/gameLogo.png";
import store from "~/store/store";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

const { $firebase } = useNuxtApp();
const auth = getAuth();
const isUser = ref(false);
const currentUser = ref({
  name: null,
  id: null,
});
const _store = store();
const router = useRouter();
const route = useRoute();
const searchResults = ref([]);
const isSmLoading = ref(false);
const isScrolledToBottom = ref(false);
const api_key = useRuntimeConfig().app.apiKey;
const errorMsg = "Username or password is incorrect!";
const errorLogin = ref(false);

const searchGame = async () => {
  try {
    if (models.value.name.length > 2) {
      isSmLoading.value = true;
      const data = await $fetch("https://api.rawg.io/api/games", {
        params: {
          key: api_key,
          search: models.value.name,
        },
      });
      searchResults.value = data?.results;
    } else {
      searchResults.value = [];
    }
  } catch (error: any) {
    console.log(error.message);
  } finally {
    isSmLoading.value = false;
  }
};

const openGame = (item: any) => {
  router.push({
    path: `/allgames/${item.name}`,
    query: { game: JSON.stringify(item) },
  });
  isSmLoading.value = false;
  searchResults.value = [];
  models.value.name = "";
};

// ! user authenticate

const form = ref(null);
const isLoginWrapper = ref(false);
const isLogin = ref(false);
const isSignUp = ref(false);
const showPassword = ref(false);

const models = ref({
  name: "",
  userFullName: "",
  email: "",
  password: "",
});

const rules = reactive({
  fullName: [
    (v: any) => !!v || "full name required",
    (v: any) => v.length > 4 || "full name must bigger than 4 characters",
  ],
  email: [
    (v: any) =>
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "email must be valid",
  ],
  password: [
    (v: any) => !!v || "password required",
    (v: any) => v.length > 5 || "password must bigger than 5 characters",
  ],
});

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const clearModel = () => {
  models.value.email = "";
  models.value.password = "";
  models.value.userFullName = "";
};

const onLogin = () => {
  clearModel();
  isLoginWrapper.value = true;
  isSignUp.value = false;
  isLogin.value = true;
};

const onSignUp = () => {
  clearModel();
  isLoginWrapper.value = true;
  isLogin.value = false;
  isSignUp.value = true;
};

const closeForm = () => {
  form.value?.reset();
  isLoginWrapper.value = false;
};

const changeLoginStatus = () => {
  if (isLogin.value) {
    onSignUp();
  } else {
    onLogin();
  }
};

const loginErrorHandle = () => {
  errorLogin.value = true;
  setTimeout(() => {
    errorLogin.value = false;
  }, 3500);
};

const loginUser = async () => {
  try {
    const u = await signInWithEmailAndPassword(
      auth,
      models.value.email,
      models.value.password
    );
    closeForm();
  } catch (error: any) {
    loginErrorHandle();
  }
};

const createUser = async () => {
  try {
    const u = await createUserWithEmailAndPassword(
      auth,
      models.value.email,
      models.value.password
    );
    _store.setUser(models.value.userFullName, u.user.uid);
    currentUser.value.name = models.value.userFullName.toUpperCase();
    currentUser.value.id = u.user.uid;
    closeForm();
  } catch (error: any) {
    console.log(error.message);
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    isUser.value = true;
    const matchedUser = _store.users.find((u: any) => u.userId === user.uid);
    if (matchedUser) {
      currentUser.value.name = matchedUser.fullName.toUpperCase();
      currentUser.value.id = user.uid;
    }
  } else {
    isUser.value = false;
  }
});

const validate = async () => {
  const { valid } = await form.value?.validate();

  if (valid) {
    if (isSignUp.value) {
      createUser();
    } else {
      loginUser();
    }
  }
};

// ! ------------

onMounted(() => {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 0) {
      isScrolledToBottom.value = true;
    } else {
      isScrolledToBottom.value = false;
    }
  });
});
</script>

<template>
  <v-app-bar
    :class="isScrolledToBottom ? 'scrolled' : ''"
    class="transition-lg bg-transparent px-3 py-2 px-sm-6 px-md-9 px-lg-12 px-xl-15"
    elevation="10"
  >
    <template v-slot:prepend>
      <div
        @click="router.replace('/')"
        class="logo cursor-pointer d-flex justify-center align-center ga-2"
      >
        <v-img :src="logo" width="50"></v-img>
        <span
          :class="isScrolledToBottom ? 'text-black' : ''"
          class="text-h5 text-md-h4 d-none d-sm-flex"
          ><strong>GK</strong>Games</span
        >
      </div>
      <div></div>
    </template>

    <template v-slot:append>
      <div class="actions d-flex justify-center align-center ga-2 ga-sm-4">
        <v-icon
          @click="_store.changeTheme"
          class="transition theme-icon mx-0 mx-sm-3 pa-5 rounded-xl"
          size="large"
          :icon="_store.theme === 'light' ? 'mdi-weather-night' : 'mdi-weather-sunny'"
        />
        <v-btn
          v-if="!isUser"
          @click="onLogin"
          variant="outlined"
          class="transition rounded-lg login-btn"
          text="Login"
        />
        <v-btn
          v-if="!isUser"
          @click="onSignUp"
          variant="outlined"
          class="transition rounded-lg signup-btn"
          text="Signup"
        />
        <div
          v-if="isUser"
          id="currentUser"
          class="cursor-pointer pa-2 pa-sm-3 bg-cyan text-white transition rounded-xl d-flex justify-center align-center ga-2"
        >
          <v-icon class="d-flex d-sm-none" icon="mdi-account" />
          <v-icon class="d-none d-sm-flex" size="x-large" icon="mdi-account" />
          <span
            class="font-weight-bold text-caption text-sm-subtitle-1"
            v-if="currentUser.name"
            >{{ currentUser?.name }}</span
          >
        </div>
        <v-menu v-if="isUser" activator="#currentUser">
          <v-list>
            <v-list-item @click="router.replace('/favorites')">
              <v-icon icon="mdi-heart" />
              <span class="mx-2">My Favorites</span>
            </v-list-item>
            <v-list-item @click="logOut">
              <v-icon icon="mdi-exit-to-app" />
              <span class="mx-2">Logout</span>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </template>
  </v-app-bar>

  <v-row class="navbar-search d-flex justify-space-between align-center mt-5 mt-sm-0">
    <v-form class="form w-75 w-md-50 mx-auto">
      <v-text-field
        v-model="models.name"
        @input="searchGame"
        color="#00e5ff"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        rounded="xl"
        label="Search"
        placeholder="Elden Ring"
      />
      <div class="search-results rounded-lg pa-3">
        <v-progress-circular
          v-if="isSmLoading"
          class="smLoadingBar"
          :size="30"
          :width="3"
          color="blue-lighten-1"
          indeterminate
        ></v-progress-circular>
        <div
          v-if="searchResults.length > 0"
          class="search-wrapper d-flex flex-column ga-1 ga-md-2 rounded-lg pa-3 pa-md-5"
        >
          <div
            @click="openGame(item)"
            v-for="item of searchResults"
            :key="item?.id"
            class="game text-white rounded-lg pa-1 pa-md-5 cursor-pointer transition d-flex justify-start align-center ga-2"
          >
            <img class="rounded-lg game-image" :src="item?.background_image" cover />
            <div class="context d-flex flex-column">
              <span class="game-title text-subtitle-2 text-md-subtitle-1">{{
                item.name
              }}</span>
              <div class="d-flex flex-wrap">
                <span
                  class="game-genre text-caption text-md-subtitle-2"
                  v-for="genre of item?.genres"
                >
                  {{ genre.name + " " }}&nbsp;
                </span>
              </div>
              <span class="game-date d-inline text-caption">
                {{ item?.released?.substring(0, 4) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </v-form>
    <v-row
      class="d-flex justify-center justify-sm-end align-center ga-1 ga-md-3 my-2 my-sm-0"
    >
      <span
        @click="router.replace('/')"
        :class="route.fullPath == '/' ? 'active-link' : ''"
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
      <v-badge
        v-if="isUser"
        class="badge-new d-none d-sm-flex transition"
        content="NEW"
        color="cyan"
        text-color="white"
      >
        <v-btn
          @click="router.replace('/gamemixer')"
          variant="outlined"
          class="bg-light-blue-darken-4 border-none rounded-xl"
          text="gameMixer"
        />
      </v-badge>
    </v-row>
  </v-row>

  <v-row v-if="isUser" class="my-5 d-flex d-sm-none justify-center align-center">
    <v-col cols="12">
      <v-btn
        @click="router.replace('/gamemixer')"
        variant="outlined"
        class="bg-light-blue-darken-2 border-none rounded-xl"
        text="gameMixer"
        block
      />
    </v-col>
  </v-row>

  <v-dialog v-model="isLoginWrapper" :max-width="600">
    <v-form
      class="login-form rounded-lg pa-5 d-flex flex-column ga-1 ga-md-2"
      ref="form"
      @submit.prevent="validate"
    >
      <h3
        v-if="isLogin"
        class="text-subtitle-1 text-md-h3 text-center text-uppercase mb-5 mb-md-10 text-white"
      >
        Login
      </h3>
      <h3
        v-if="isSignUp"
        class="text-subtitle-1 text-md-h3 text-center text-uppercase mb-5 mb-md-10 text-white"
      >
        Signup
      </h3>
      <v-text-field
        v-if="isSignUp"
        class="fullname-input"
        v-model="models.userFullName"
        :rules="rules.fullName"
        type="text"
        prepend-inner-icon="mdi-account"
        label="full name"
        variant="outlined"
        placeholder="John Doe"
        color="cyan"
        rounded="xl"
        clerable
      />
      <v-text-field
        class="email-input"
        v-model="models.email"
        :rules="rules.email"
        type="text"
        prepend-inner-icon="mdi-email"
        label="email"
        variant="outlined"
        placeholder="johndoe@mail.com"
        color="cyan"
        rounded="xl"
        clerable
      />
      <v-text-field
        class="passw-input"
        v-model="models.password"
        :rules="rules.password"
        :type="showPassword ? 'text' : 'password'"
        prepend-inner-icon="mdi-lock"
        label="password"
        variant="outlined"
        rounded="xl"
        color="cyan"
      >
        <template v-slot:append-inner>
          <v-icon
            :icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click="togglePasswordVisibility"
          />
        </template>
      </v-text-field>
      <v-btn
        type="submit"
        variant="outlined"
        class="bg-success border-none rounded-xl font-weight-bold"
        :text="isSignUp ? 'signup' : 'login'"
      />
      <v-btn
        @click="closeForm"
        variant="outlined"
        class="bg-error border-none rounded-xl font-weight-bold"
        text="cancel"
      />
      <div class="mx-auto mt-2 mt-md-4">
        <span
          @click="changeLoginStatus"
          class="action-text transition text-caption text-sm-subtitle-2 text-grey cursor-pointer"
        >
          {{ isLogin ? "Don't have an account yet?" : "Do you already have an account?" }}
        </span>
      </div>
      <div class="d-flex justify-center align-center" v-if="errorLogin">
        <span class="text-subtitle-2 text-md-subtitle-1 text-error">{{ errorMsg }}</span>
      </div>
    </v-form>
  </v-dialog>
</template>

<style scoped>
@import url(/assets/css/main.css);

.badge-new:hover {
  margin-bottom: 0.5rem;
}

.scrolled {
  background-color: #fff !important;
}
.login-form {
  background: #1a2537;
}
.fullname-input,
.email-input,
.passw-input {
  color: #fff !important;
}
.action-text {
  letter-spacing: 1px;
}
.action-text:hover {
  color: #fff !important;
  text-decoration: underline;
}
.form {
  position: relative;
}
.smLoadingBar {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
.search-results {
  position: absolute;
  width: 100%;
  z-index: 999;
  left: 0;
}
.search-wrapper {
  background-color: #1a2537;
  overflow-y: scroll;
  height: 30rem !important;
  scrollbar-width: thin;
  scrollbar-color: #1a2537 #f0e8e8;
  scroll-behavior: smooth;
}
.game {
  background-color: rgba(255, 255, 255, 0.2);
}
.game-image {
  width: 5rem !important;
  height: 100% !important;
}
.game:hover .game-title {
  color: #00e5ff;
}
.game:hover .game-genre {
  color: #00e5ff;
}
.game:hover .game-date {
  color: #00e5ff;
}
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
.theme-icon {
  background-color: rgba(0, 0, 0, 0.5) !important;
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
