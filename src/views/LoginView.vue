<template >
    <el-row>
        <el-col :span="8"></el-col>
        <el-col :span="8">
            <h1>{{  titleLanguage.titleHeader }}</h1>
            <el-form>
                <el-form-item :label="titleLanguage.title_email" :label-width="100">
                    <el-input v-model="email" :placeholder="titleLanguage.enter_email" type="email"></el-input>
                </el-form-item>
                <el-form-item :label="titleLanguage.title_password" :label-width="100">
                    <el-input v-model="password" :placeholder="titleLanguage.enter_password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="margin-left: 80%;" @click="login()">{{ titleLanguage.login }}</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-col :span="8"></el-col>
    </el-row>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import AuthService from '@/service/AuthService'
import { AuthenticateUtil } from "@/utils/auth"
import router from "@/router"
import { ElLoading, ElMessage } from "element-plus"
import store from "@/store/LanguageStore"
import { AppConstants } from "@/app-const"

export default defineComponent({
    name: "LoginView",
    data() {
        return {
            email: "",
            password: "",
            languageValue: 1,
            titleLanguage: {} as any
        }
    },
    mounted() {
        this.languageValue = store.state.language
        this.changeLanguage()
        store.watch(
            state => state.language,
            newValue => {
                this.languageValue = newValue
                this.changeLanguage()
            }
        )
    },
    methods: {
        changeLanguage() {
            if (this.languageValue == 1) {
                this.titleLanguage = AppConstants.languageLoginVi
            } if (this.languageValue == 2) {
                this.titleLanguage = AppConstants.languageLoginEn
            } if (this.languageValue == 3) {
                this.titleLanguage = AppConstants.languageLoginJp
            }
        },
        login() {
            const loading = ElLoading.service({
                lock: true,
                text: this.titleLanguage.loading,
                background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(() => {
                const payload = { "email": this.email, "password": this.password }
                AuthService.login(payload).then((res: any) => {
                    if (res.data.accessToken) {
                        AuthenticateUtil.setJwtToSession(res.data.accessToken);
                        localStorage.setItem('payloadUser', JSON.stringify(res.data.user))

                        const checkJwt = AuthenticateUtil.checkJwt();
                        store.state.checkJwt = checkJwt
                        if (checkJwt) {
                            store.state.checkJwt = true
                            router.push('/')
                        } else {
                            router.push('/login')
                        }
                    }
                    loading.close()
                }).catch((res) => {
                    if (res.response) {
                        ElMessage({
                            showClose: true,
                            message: this.titleLanguage.login_error,
                            type: 'error',
                        })
                        this.email = ""
                        this.password = ""
                    }
                    loading.close()
                })
            }, 500);
        }
    },
})
</script>
<style lang="css">
.dark__mode .el-form-item__label,
.dark__mode h1 {
    color: var(--color-text);
}
</style>