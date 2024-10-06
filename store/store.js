import { defineStore } from "pinia";

const store = defineStore("piniaStore", {
    state() {
        const config = useRuntimeConfig();
        return {
            theme: null,
            isLoading: false,
            api_key: config.app.apiKey,
            currentPageUrl: `https://api.rawg.io/api/games?key=${config.app.apiKey}`,
            currentPageUrlByCategories: `https://api.rawg.io/api/games?key=${config.app.apiKey}`,
            allGamesList: null,
            allGamesListByCategory: null,
            genres: null,
            activeCategory: null,
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
        },
        async getAllGameByCategories(url) {
            try {
                this.isLoading = true;
                const data = await $fetch(this.currentPageUrlByCategories)
                this.allGamesListByCategory = data;
            } catch (error) {
                console.error(error.message)
            } finally {
                this.isLoading = false;
            }
        },
        setCurrentPageUrlByCategories(url) {
            this.currentPageUrlByCategories = url;
            this.getAllGameByCategories(url);
        },
        setComingSoon() {
            if (this.activeCategory === "coming soon") {
                this.activeCategory = null;
                this.getAllGameByCategories(this.currentPageUrl)
            } else {
                this.activeCategory = "coming soon";
                this.currentPageUrlByCategories = `https://api.rawg.io/api/games?key=${this.api_key}&dates=2024-10-05,2025-10-05&ordering=released`;
                this.getAllGameByCategories(this.currentPageUrlByCategories);
            }
        },
        setRecentlyAdded() {
            if (this.activeCategory === "recently added") {
                this.activeCategory = null;
                this.getAllGameByCategories(this.currentPageUrl)
            } else {
                this.activeCategory = "recently added";
                this.currentPageUrlByCategories = `https://api.rawg.io/api/games?key=${this.api_key}&ordering=-added`;
                this.getAllGameByCategories(this.currentPageUrlByCategories);
            }
        },
        setTopRated() {
            if (this.activeCategory === "top rated") {
                this.activeCategory = null;
                this.getAllGameByCategories(this.currentPageUrl)
            } else {
                this.activeCategory = "top rated";
                this.currentPageUrlByCategories = `https://api.rawg.io/api/games?key=${this.api_key}&ordering=-metacritic`;
                this.getAllGameByCategories(this.currentPageUrlByCategories);
            }
        }
    },
    persist: true
});

export default store;
