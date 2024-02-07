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

export default defineComponent({
    name: "LoginView",
    data() {
        return {
            email: "",
            password: "",
            languageValue: 1,
            titleLanguage: {
                "titleHeader": "Đăng nhập",
                "title_email": "Email",
                "title_password": "Mật khẩu",
                "enter_email": "Nhập email của bạn...",
                "enter_password": "Nhập mật khẩu của bạn...",
                "login": "Đăng nhập"
            }
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
                this.titleLanguage = {
                    "titleHeader": "Đăng nhập",
                    "title_email": "Email",
                    "title_password": "Mật khẩu",
                    "enter_email": "Nhập email của bạn...",
                    "enter_password": "Nhập mật khẩu của bạn...",
                    "login": "Đăng nhập"
                }
            } else if (this.languageValue == 2) {
                this.titleLanguage = {
                    "titleHeader": "Login",
                    "title_email": "Email",
                    "title_password": "Password",
                    "enter_email": "Enter your email...",
                    "enter_password": "Enter your password...",
                    "login": "Login"
                }
            } else if (this.languageValue == 3) {
                this.titleLanguage = {
                    "titleHeader": "ログイン",
                    "title_email": "メール",
                    "title_password": "パスワード",
                    "enter_email": "メールを入力してください...",
                    "enter_password": "パスワードを入力してください...",
                    "login": "ログイン"
                }
            }
        },
        login() {
            const loading = ElLoading.service({
                lock: true,
                text: 'Loading',
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
                            message: 'Email hoặc mật khẩu không chính xác!',
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