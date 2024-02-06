<template >
    <el-row>
        <el-col :span="8"></el-col>
        <el-col :span="8">
            <h1>Đăng nhập</h1>
            <el-form>
                <el-form-item label="Email" :label-width="80">
                    <el-input v-model="email" placeholder="Enter your email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="Password" :label-width="80">
                    <el-input v-model="password" placeholder="Enter your password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" style="margin-left: 80%;" @click="login()">Đăng nhập</el-button>
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
            password: ""
        }
    },
    methods: {
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
                        sessionStorage.setItem('payloadUser', JSON.stringify(res.data.user))

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