<template>
    <el-row class="header__intruction__container">
        <el-col :span="4"></el-col>
        <el-col :span="16">
            <nav class="header__intruction__element__ul__menu">
                <div>
                    <template v-if="languageValue == 1">
                            <router-link :to="headerVi.link"><img :src="headerVi.logo" alt="logo">{{ headerVi.title
                            }}</router-link>
                        </template>
                        <template v-if="languageValue == 2">
                            <router-link :to="headerEn.link"><img :src="headerEn.logo" alt="logo">{{ headerEn.title
                            }}</router-link>
                        </template>
                        <template v-if="languageValue == 3">
                            <router-link :to="headerJp.link"><img :src="headerJp.logo" alt="logo">{{ headerJp.title
                            }}</router-link>
                        </template>
                </div>
                <div>
                    <router-link class="item" to="tel:0348485360">
                            <el-icon>
                                <Phone />
                            </el-icon>
                        </router-link>
                        <router-link class="item" to="tel:0348485360">
                            <el-icon>
                                <ChatRound />
                            </el-icon>
                        </router-link>
                        <router-link class="item" to="tel:0348485360">
                            <el-icon>
                                <LocationFilled />
                            </el-icon>
                        </router-link>
                        <el-button @click="changeMode()">
                            <el-icon v-if="darkMode">
                                <Moon />
                            </el-icon>
                            <el-icon v-if="!darkMode">
                                <Sunny />
                            </el-icon>
                        </el-button>
                        &nbsp;
                        <el-select v-model="languageValue" placeholder="Select" style="width: 120px">
                            <el-option v-for="item in languages" :key="item.id" :label="item.name" :value="item.id" />
                        </el-select>
                </div>
            </nav>
        </el-col>
        <el-col :span="4"></el-col>
    </el-row>
</template>
<script lang="ts">
import store from '../../../store/LanguageStore'
import { defineComponent } from 'vue'
export default defineComponent({
    name: 'HeaderIntruction',
    data() {
        return {
            headerVi: { "id": 1, "title": "CLB LIÊN QUÂN", "link": "/", "logo": "https://luvina.net/public/media//logo-luvina-2022-2.png" },
            headerEn: { "id": 2, "title": "ARENA OF VALOR CLUB", "link": "/", "logo": "https://luvina.net/public/media//logo-luvina-2022-2.png" },
            headerJp: { "id": 3, "title": "モバイル連合クラブ", "link": "/", "logo": "https://luvina.net/public/media//logo-luvina-2022-2.png" },
            darkMode: false,
            languages: [
                { "id": 1, "name": "Tiếng Việt" },
                { "id": 2, "name": "English" },
                { "id": 3, "name": "Japanese" }
            ],
            languageValue: 1
        }
    },
    methods: {
        changeMode() {
            this.darkMode = !this.darkMode
            this.$emit("darkMode", this.darkMode)
        }
    },
    watch: {
        languageValue: function (newData) {
            store.commit('changeLanguage', newData)
            this.languageValue = store.state.language
        }
    },
    mounted() {
        this.languageValue = store.state.language
    },
})
</script>
<style lang="css">
nav {
    padding: 7px;
}

nav a {
    font-weight: bold;
    color: #2c3e50;
}


.header__intruction__container {
    background-color: var(--color-background-header-intruction);
    height: 110px;
}

.header__intruction__element__ul__menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header__intruction__element__ul__menu .item:not(:last-child)::after {
    content: "|";
    margin: 0px 10px;
}

.header__intruction__element__ul__menu .item {
    font-size: var(--fontsize-small);
    color: var(--color-text);
    font-weight: 100;
}
</style>