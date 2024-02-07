<template>
  <el-dialog v-model="internalVisible" :show-close="false">
    <template #header>
      <div class="my-header">
        <h2>{{ titleLanguage.titleHeader }} {{ matchDetail.date }}</h2>
        <el-button type="danger" @click="closeDialog()">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          {{ titleLanguage.close }}
        </el-button>
      </div>
    </template>
    <div>
      <h3>{{ titleLanguage.info_position }} </h3>
      {{ titleLanguage.rank_1 }} {{ matchDetail.rank_1 }}<br />
      {{ titleLanguage.rank_2 }} {{ matchDetail.rank_2 }}<br />
      {{ titleLanguage.rank_3 }} {{ matchDetail.rank_3 }}<br />
      {{ titleLanguage.rank_4 }} {{ matchDetail.rank_4 }}<br />
      {{ titleLanguage.rank_5 }} {{ matchDetail.rank_5 }}<br />
      <h3>{{ titleLanguage.championInfo }}</h3>
      <template v-if="!displayListChampion">
        {{ titleLanguage.question }}
        <el-button :loading="isLoadingButtonNoChange" :disabled="!enableButtonNoChange" type="danger"
          @click="displayList(false)">
          <el-icon>
            <Close />
          </el-icon>
          {{ titleLanguage.answer1 }}
        </el-button>
        <el-button :loading="isLoadingButtonChange" :disabled="!enableButtonChange" type="success"
          @click="displayList(true)">
          <el-icon>
            <Check />
          </el-icon>
          {{ titleLanguage.answer2 }}
        </el-button>
      </template>
      <el-row v-if="displayListChampion">
        <el-col :span="5">
          <strong>{{ titleLanguage.champion_top }}</strong> <br>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_top" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <strong>{{ titleLanguage.champion_mid }}</strong> <br>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_mid" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <strong>{{ titleLanguage.champion_jungle }}</strong>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_jungle" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <strong>{{ titleLanguage.champion_ad }}</strong>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_ad" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="4">
          <strong>{{ titleLanguage.champion_sp }}</strong>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_sp" :key="index">{{ item }}</li>
          </ul>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
  
<script lang="ts">
import { defineComponent } from 'vue'
import MatchService from '@/service/MatchService'
import store from '@/store/LanguageStore'
import { ElMessage } from 'element-plus'
import { AllUtil } from '@/utils/allUtil'

export default defineComponent({
  name: "MatchDetail",
  data() {
    return {
      titleLanguage: {
        "titleHeader": "Tướng đường và vị trí ngày:",
        "rank_1": "Hạng 1:",
        "rank_2": "Hạng 2:",
        "rank_3": "Hạng 3:",
        "rank_4": "Hạng 4:",
        "rank_5": "Hạng 5:",
        "championInfo": "Thông tin tướng",
        "question": "Hạng 5 có muốn đổi vị trí với hạng 1 không?",
        "answer1": "Không đổi",
        "answer2": "Đổi",
        "champion_top": "Tướng đường top",
        "champion_jungle": "Tướng đường rừng",
        "champion_mid": "Tướng đường mid",
        "champion_ad": "Tướng đường ad",
        "champion_sp": "Tướng đường sp",
        "info_position": "Thông tin vị trí:",
        "close":"Đóng",
        "accepted":"Xác nhận đổi đường!",
        "non_accepted":"Xác nhận không đổi đường!"
      },
      matchDetail: {
        "champion_top": "",
        "champion_jungle": "",
        "champion_mid": "",
        "champion_ad": "",
        "champion_sp": "",
      },
      internalVisible: false,
      displayListChampion: false,
      isLoadingButtonChange: false,
      isLoadingButtonNoChange: false,
      enableButtonChange: true,
      enableButtonNoChange: true,
      idDetail: 1,
      arrChampion_top: [] as string[],
      arrChampion_jungle: [] as string[],
      arrChampion_mid: [] as string[],
      arrChampion_ad: [] as string[],
      arrChampion_sp: [] as string[],

    }
  },
  props:
    ['runHandle', 'languageValue']
  ,
  mounted() {
    this.isLoadingButtonChange = false;
    this.isLoadingButtonNoChange = false;
  },
  updated() {
    this.arrChampion_top = AllUtil.strChampionToArray(this.matchDetail.champion_top)
    this.arrChampion_jungle = AllUtil.strChampionToArray(this.matchDetail.champion_jungle)
    this.arrChampion_mid = AllUtil.strChampionToArray(this.matchDetail.champion_mid)
    this.arrChampion_ad = AllUtil.strChampionToArray(this.matchDetail.champion_ad)
    this.arrChampion_sp = AllUtil.strChampionToArray(this.matchDetail.champion_sp)
    
    this.changeLanguage(this.languageValue)
  },
  watch: {
    internalVisible: function (newValue) {
      if (!newValue) {
        store.state.displayPhao = false
      }
    }
  },
  methods: {
    async handleData(id: number, language: number, displayListChampion: boolean) {
      this.idDetail = id
      const { data } = await MatchService.getOneMatch(id);
      data.date = AllUtil.timeToDateTimeFormat(data.date)
      this.matchDetail = data
      this.internalVisible = true
      this.displayListChampion = displayListChampion
    },
    async updateChangePositon(id: number, changePosition: boolean) {
      return await MatchService.updateChangePosition(id, changePosition)
    },
    closeDialog() {
      this.internalVisible = false
      store.state.displayPhao = false
    },
    displayList(change: boolean) {
      if (change) {
        this.isLoadingButtonChange = true
        this.enableButtonNoChange = false
      } else {
        this.isLoadingButtonNoChange = true
        this.enableButtonChange = false
      }
      this.updateChangePositon(this.idDetail, change)

      setTimeout(() => {
        ElMessage({
          showClose: true,
          message: change == true ? this.titleLanguage.accepted : this.titleLanguage.non_accepted,
          type: 'success',
        })
        this.isLoadingButtonChange = false
        this.isLoadingButtonNoChange = false
        this.enableButtonChange = true;
        this.enableButtonNoChange = true;
        this.displayListChampion = true
        this.$emit('getMatchAgain')
      }, 1000);
    },
    changeLanguage(languageValue: number) {
      if (languageValue == 1) {
        this.titleLanguage = {
          "titleHeader": "Tướng đường và vị trí ngày:",
          "rank_1": "Hạng 1:",
          "rank_2": "Hạng 2:",
          "rank_3": "Hạng 3:",
          "rank_4": "Hạng 4:",
          "rank_5": "Hạng 5:",
          "championInfo": "Thông tin tướng",
          "question": "Hạng 5 có muốn đổi vị trí với hạng 1 không?",
          "answer1": "Không đổi",
          "answer2": "Đổi",
          "champion_top": "Tướng đường top",
          "champion_jungle": "Tướng đường rừng",
          "champion_mid": "Tướng đường mid",
          "champion_ad": "Tướng đường ad",
          "champion_sp": "Tướng đường sp",
          "info_position": "Thông tin vị trí:",
          "close": "Đóng",
          "accepted": "Xác nhận đổi đường!",
          "non_accepted":"Xác nhận không đổi đường!"
        }
      } else if (languageValue == 2) {
        this.titleLanguage = {
          "titleHeader": "Champion and Position of the Day:",
          "rank_1": "Rank 1:",
          "rank_2": "Rank 2:",
          "rank_3": "Rank 3:",
          "rank_4": "Rank 4:",
          "rank_5": "Rank 5:",
          "championInfo": "Champion Information",
          "question": "Does Rank 5 want to switch positions with Rank 1?",
          "answer1": "No",
          "answer2": "Yes",
          "champion_top": "Top Lane Champion",
          "champion_jungle": "Jungle Champion",
          "champion_mid": "Mid Lane Champion",
          "champion_ad": "AD Carry Champion",
          "champion_sp": "Support Champion",
          "info_position": "Position Information:",
          "close": "Close",
          "accepted": "Accepted change position!",
          "non_accepted":"Non-accepted change position!"
        }
      } else if (languageValue == 3) {
        this.titleLanguage = {
          "titleHeader": "今日のチャンピオンとポジション:",
          "rank_1": "ランク1：",
          "rank_2": "ランク2：",
          "rank_3": "ランク3：",
          "rank_4": "ランク4：",
          "rank_5": "ランク5：",
          "championInfo": "チャンピオン情報",
          "question": "ランク5はランク1とポジションを交換しますか？",
          "answer1": "いいえ",
          "answer2": "はい",
          "champion_top": "トップレーンのチャンピオン",
          "champion_jungle": "ジャングルのチャンピオン",
          "champion_mid": "ミッドレーンのチャンピオン",
          "champion_ad": "ADキャリーのチャンピオン",
          "champion_sp": "サポートのチャンピオン",
          "info_position": "ポジション情報:",
          "close": "近い",
          "accepted": "ルート変更の確認!",
          "non_accepted":"ルート変更がないことを確認!"
        }
      }
    }
  }
})
</script>
  
<style scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.my-header h2 {
  margin-bottom: 20px
}

.list__champion__detail {
  list-style-type: none;
  padding-inline-start: 15px;
}

.list__champion__detail li:nth-child(-n+5) {
  color: red;
}
</style>