import { defineStore } from "pinia";

const store = defineStore("piniaStore", {
    state() {
        const config = useRuntimeConfig();
        return {
            theme: null,
            isLoading: false,
            api_key: config.app.apiKey,
            currentPageUrl: `https://api.rawg.io/api/games?key=${config.app.apiKey}`,
            allGamesList: null,
            genres: null,
            activeCategory: null
        };
    },
    actions: {
        changeTheme() {
            this.theme === 'light'
                ? this.theme = 'dark'
                : this.theme = 'light';
        },
        async getAllGames(url) {
            try {
                this.isLoading = true;
                const response = await $fetch(url);
                this.allGamesList = response;
            } catch (error) {
                console.log(error.message);
            } finally {
                this.isLoading = false;
            }
        },
        setCurrentPageUrl(url) {
            this.currentPageUrl = url;
            this.getAllGames(url);
        },
        async getGenres() {
            try {
                this.isLoading = true;
                const data = await $fetch(`https://api.rawg.io/api/genres?key=${this.api_key}`);
                this.genres = data?.results;
            } catch (error) {
                console.log(error.message);
            } finally {
                this.isLoading = false;
            }
        }
    },
    persist: true
});

export default store;
