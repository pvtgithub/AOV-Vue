<template>
  <el-dialog v-model="internalVisible" :show-close="false">
    <template #header>
      <div class="my-header">
        <h2>Tướng đường và vị trí ngày: {{ matchDetail.date }}</h2>
        <el-button type="danger" @click="closeDialog()">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button>
      </div>
    </template>
    <div>
      <h3>Thông tin vị trí: </h3>
      Hạng 1: {{ matchDetail.rank_1 }}<br />
      Hạng 2: {{ matchDetail.rank_2 }}<br />
      Hạng 3: {{ matchDetail.rank_3 }}<br />
      Hạng 4: {{ matchDetail.rank_4 }}<br />
      Hạng 5: {{ matchDetail.rank_5 }}<br />
      <h3>Thông tin tướng</h3>
      <template v-if="!displayListChampion">
        Hạng 5 có muốn đổi vị trí với hạng 1 không?
        <el-button :loading="isLoadingButtonNoChange" :disabled="!enableButtonNoChange" type="danger" @click="displayList(false)">
          <el-icon>
            <Close />
          </el-icon>
          Không đổi
        </el-button>
        <el-button :loading="isLoadingButtonChange" :disabled="!enableButtonChange" type="success" @click="displayList(true)">
          <el-icon>
            <Check />
          </el-icon>
          Đổi
        </el-button>
      </template>
      <el-row v-if="displayListChampion">
        <el-col :span="5">
          <strong>Tướng đường top</strong> <br>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_top" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <strong>Tướng đường mid</strong> <br>
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_mid" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <strong>Tướng đường rừng</strong> 
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_jungle" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="5">
          <strong>Tướng đường ad</strong> 
          <ul class="list__champion__detail">
            <li v-for="(item, index) in arrChampion_ad" :key="index">{{ item }}</li>
          </ul>
        </el-col>
        <el-col :span="4">
          <strong>Tướng đường sp</strong> 
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
      matchDetail: {
        "champion_top" : "",
        "champion_jungle" : "",
        "champion_mid" : "",
        "champion_ad" : "",
        "champion_sp" : "",
      },
      internalVisible: false,
      displayListChampion: false,
      isLoadingButtonChange: false,
      isLoadingButtonNoChange: false,
      enableButtonChange: true,
      enableButtonNoChange: true,
      idDetail: 1,
      arrChampion_top: [] as string [],
      arrChampion_jungle: [] as string [],
      arrChampion_mid: [] as string [],
      arrChampion_ad: [] as string [],
      arrChampion_sp: [] as string [],

    }
  },
  props:
    ['runHandle']
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

  },
  watch: {
    internalVisible : function(newValue) {
       if(!newValue){
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
          message: change == true ? 'Xác nhận đổi đường' : 'Xác nhận không đổi đường',
          type: 'success',
        })
        this.isLoadingButtonChange = false
        this.isLoadingButtonNoChange = false
        this.enableButtonChange = true;
        this.enableButtonNoChange = true;
        this.displayListChampion = true
        this.$emit('getMatchAgain')
      }, 1000);
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
.list__champion__detail{
  list-style-type: none;
  padding-inline-start: 15px;
}
.list__champion__detail li:nth-child(-n+5){
  color: red;
}
</style>