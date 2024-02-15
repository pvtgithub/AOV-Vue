<template>
    <template v-if="languageValue == 1">
        <div class="footer__container">
            <el-row>
                <el-col class="footer__row__bottom" :span="24">
                    {{ contentBottomVi }}
                </el-col>
            </el-row>
        </div>
    </template>
    <template v-if="languageValue == 2">
        <div class="footer__container">
            <el-row>
                <el-col class="footer__row__bottom" :span="24">
                    {{ contentBottomEn }}
                </el-col>
            </el-row>
        </div>
    </template>
    <template v-if="languageValue == 3">
        <div class="footer__container">
            <el-row>
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
import { AppConstants } from '@/app-const'


export default defineComponent({
    name: "FooterComponent",
    data() {
        return {
            languageValue: 1,
            contentBottomVi: AppConstants.languageFooterVi.contentBottom,
            contentBottomEn: AppConstants.languageFooterEn.contentBottom,
            contentBottomJp: AppConstants.languageFooterJp.contentBottom,
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