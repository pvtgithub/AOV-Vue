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
                    <router-link class="item" to="/a">
                        <el-icon>
                            <Phone />
                        </el-icon>
                    </router-link>
                    <router-link class="item" to="/a">
                        <el-icon>
                            <ChatRound />
                        </el-icon>
                    </router-link>
                    <router-link class="item" to="/a">
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
                    &nbsp;
                    <template v-if="!checkJwt">
                        <el-button @click="login()">
                            <el-icon>
                                <User />
                            </el-icon>
                            {{ titleLanguage.login }}
                        </el-button>
                        <el-button @click="register()">
                            <el-icon>
                                <EditPen />
                            </el-icon>
                            {{ titleLanguage.register }}
                        </el-button>
                    </template>
                    <template v-if="checkJwt">
                        <el-button @click="logout()">
                            <el-icon>
                                <Refresh />
                            </el-icon>
                            {{ titleLanguage.logout }}
                        </el-button>
                        <el-button @click="avatar()">
                            <el-icon>
                                <Avatar />
                            </el-icon>
                            {{ email_user }}
                        </el-button>
                    </template>
                </div>
            </nav>
        </el-col>
        <el-col :span="4"></el-col>
    </el-row>
</template>
<script lang="ts">
import { AuthenticateUtil } from '@/utils/auth'
import store from '../../../store/LanguageStore'
import { defineComponent } from 'vue'
import router from '@/router'
import { ElLoading, ElMessage } from 'element-plus'
import { AllUtil } from '@/utils/allUtil'
import { AppConstants } from '@/app-const'
export default defineComponent({
    name: 'HeaderIntruction',
    data() {
        return {
            headerVi: { "id": 1, "title": "CLB LIÊN QUÂN", "link": "/", "logo": "https://luvina.net/public/media//logo-luvina-2022-2.png" },
            headerEn: { "id": 2, "title": "ARENA OF VALOR CLUB", "link": "/", "logo": "https://luvina.net/public/media//logo-luvina-2022-2.png" },
            headerJp: { "id": 3, "title": "モバイル連合クラブ", "link": "/", "logo": "https://luvina.net/public/media//logo-luvina-2022-2.png" },
            titleLanguage: {} as any,
            darkMode: false,
            languages: [
                { "id": 1, "name": "Tiếng Việt" },
                { "id": 2, "name": "English" },
                { "id": 3, "name": "Japanese" }
            ],
            languageValue: 1 as any,
            checkJwt: store.state.checkJwt,
        }
    },
    methods: {
        changeMode() {
            this.darkMode = !this.darkMode
            store.commit('changeDarkMode', this.darkMode)
            localStorage.setItem('darkMode', this.darkMode.toString())
        },
        changeLanguage() {
            if (this.languageValue == 1) {
                this.titleLanguage = AppConstants.languageHeaderVi
            } if (this.languageValue == 2) {
                this.titleLanguage = AppConstants.languageHeaderEn
            } if (this.languageValue == 3) {
                this.titleLanguage = AppConstants.languageHeaderJp
            }
        },
        login() {
            router.push('/login')
        },
        register() {
            ElMessage({
                showClose: true,
                message: this.titleLanguage.registerMessage,
                type: 'warning',
            })
        },
        avatar() {
            console.log("no thing!!!");
        },
        logout() {
            const loading = ElLoading.service({
                lock: true,
                text: this.titleLanguage.loading,
                background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(() => {
                const accessToken = AuthenticateUtil.getJwtFromSession()
                if (accessToken) {
                    AuthenticateUtil.removeJwtFromSession()
                    store.dispatch('updatePayloadUser', {})
                    loading.close()
                    store.state.checkJwt = false
                    router.push('/login')
                }
            }, 300)

        }
    },
    watch: {
        languageValue: function (newData) {
            store.commit('changeLanguage', newData)
            localStorage.setItem('customLanguage', newData)
            this.languageValue = AllUtil.getLanguageFromStorage()
            this.changeLanguage()
        }
    },
    computed: {
        email_user() {
            return store.state.payloadUser.email;
        }
    },
    mounted() {
        this.languageValue = AllUtil.getLanguageFromStorage()
        this.checkJwt = store.state.checkJwt
        this.darkMode = localStorage.getItem('darkMode') === 'true'
        store.watch(
            state => state.checkJwt,
            newValue => {
                this.checkJwt = newValue
            }
        )
        this.changeLanguage()
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