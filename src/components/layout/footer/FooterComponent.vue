<template>
    <template v-if="languageValue == 1">
        <div class="footer__container">
            <el-row>
                <el-col class="footer__row" :span="24">
                    <router-link v-for="item in listLinkVi" :key="item.id" :to="item.link" class="item">{{ item.title
                    }}</router-link>
                </el-col>
                <el-col class="footer__row__bottom" :span="24">
                    {{ contentBottomVi }}
                </el-col>
            </el-row>
        </div>
    </template>
    <template v-if="languageValue == 2">
        <div class="footer__container">
            <el-row>
                <el-col class="footer__row" :span="24">
                    <router-link v-for="item in listLinkEn" :key="item.id" :to="item.link" class="item">{{ item.title
                    }}</router-link>
                </el-col>
                <el-col class="footer__row__bottom" :span="24">
                    {{ contentBottomEn }}
                </el-col>
            </el-row>
        </div>
    </template>
    <template v-if="languageValue == 3">
        <div class="footer__container">
            <el-row>
                <el-col class="footer__row" :span="24">
                    <router-link v-for="item in listLinkJp" :key="item.id" :to="item.link" class="item">{{ item.title
                    }}</router-link>
                </el-col>
                <el-col class="footer__row__bottom" :span="24">
                    {{ contentBottomJp }}
                </el-col>
            </el-row>
        </div>
    </template>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store/LanguageStore'


export default defineComponent({
    name: "FooterComponent",
    data() {
        return {
            languageValue: 1,
            listLinkVi: [
                { "id": 1, "title": "Trang chủ", "link": "/" },
                { "id": 2, "title": "Giới thiệu", "link": "/gioi-thieu" },
                { "id": 3, "title": "Liên hệ", "link": "/lien-he" },
                { "id": 4, "title": "Bản đồ đến shop", "link": "/map" },
                { "id": 5, "title": "Tuyển dụng", "link": "/tuyen-dung" },
                { "id": 6, "title": "Đăng tranh", "link": "/dang-tranh" },
                { "id": 7, "title": "Đăng nhập", "link": "/dang-nhap" },
                { "id": 8, "title": "Đăng ký", "link": "/dang-ky" },
            ],
            listLinkEn: [
                { "id": 1, "title": "Home", "link": "/" },
                { "id": 2, "title": "Introduction", "link": "/gioi-thieu" },
                { "id": 3, "title": "Contact", "link": "/lien-he" },
                { "id": 4, "title": "Map to shop", "link": "/map" },
                { "id": 5, "title": "Recruitment", "link": "/tuyen-dung" },
                { "id": 6, "title": "Post picture", "link": "/dang-tranh" },
                { "id": 7, "title": "Login", "link": "/dang-nhap" },
                { "id": 8, "title": "Register", "link": "/dang-ky" },
            ],
            listLinkJp: [
                { "id": 1, "title": "ホームページ", "link": "/" },
                { "id": 2, "title": "導入", "link": "/gioi-thieu" },
                { "id": 3, "title": "接触", "link": "/lien-he" },
                { "id": 4, "title": "地図", "link": "/map" },
                { "id": 5, "title": "募集", "link": "/tuyen-dung" },
                { "id": 6, "title": "写真を投稿する", "link": "/dang-tranh" },
                { "id": 7, "title": "ログイン", "link": "/dang-nhap" },
                { "id": 8, "title": "登録する", "link": "/dang-ky" },
            ],
            contentBottomVi: "Copyright © 2024 Luvina. Ghi rõ nguồn 'luvina.net' khi sử dụng thông tin từ website này",
            contentBottomEn: "Copyright © 2024 PAINTING SALE. Specify the source 'luvina.net' when using information from this website",
            contentBottomJp: "Copyright © 2024 絵画販売.このウェブサイトの情報を使用する場合は、出典「luvina.net」を指定してください",
        }
    },
    mounted() {
        this.languageValue = store.state.language
        store.watch(
            state => state.language,
            newValue => {
                this.languageValue = newValue
            }
        )
    }
})
</script>
<style lang="css">
.footer__container {
    padding: 20px;
}

.footer__row {
    font-size: var(--fontsize-small);
}

.footer__row__bottom {
    margin-top: 10px;
    font-size: var(--fontsize-normal);
}

.footer__row a:not(:last-child) {
    margin-right: 10px
}
</style>