<template>
  <el-dialog v-model="internalVisible" :show-close="false">
    <template #header>
      <div class="my-header">
        <h2>Danh sách tướng và vị trí ngày: {{ matchDetail.date }}</h2>
        <el-button type="danger" @click="closeDialog()">
          <el-icon class="el-icon--left">
            <CircleCloseFilled />
          </el-icon>
          Close
        </el-button>
      </div>
    </template>
    <div >
      <h3>Thông tin vị trí: </h3>
      Hạng 1: {{ matchDetail.rank_1 }}<br/>
      Hạng 2: {{ matchDetail.rank_2 }}<br/>
      Hạng 3: {{ matchDetail.rank_3 }}<br/>
      Hạng 4: {{ matchDetail.rank_4 }}<br/>
      Hạng 5: {{ matchDetail.rank_5 }}<br/>
      <h3>Thông tin tướng</h3>
      <el-button v-if="!displayListChampion" @click="displayList()">
      <el-icon><View /></el-icon>
          Hiển thị danh sách tướng
    </el-button>
      <el-row v-if="displayListChampion">
        <el-col :span="2"></el-col>
        <el-col :span="4">
          <strong>Danh sách tướng top:</strong> <br>{{ matchDetail.champion_top }}
        </el-col>
        <el-col :span="4">
          <strong>Danh sách tướng mid:</strong> <br>{{ matchDetail.champion_mid }}
        </el-col>
        <el-col :span="4">
          <strong>Danh sách tướng ad:</strong> <br>{{ matchDetail.champion_ad }}
        </el-col>
        <el-col :span="4">
          <strong>Danh sách tướng rừng:</strong> <br>{{ matchDetail.champion_jungle }}
        </el-col>
        <el-col :span="4">
          <strong>Danh sách tướng sp:</strong> <br>{{ matchDetail.champion_sp }}
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
  
<script lang="ts">
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { defineComponent } from 'vue'
import MatchService from '@/service/MatchService'
import store from '@/store/LanguageStore'

export default defineComponent({
  name: "MatchDetail",
  data() {
    return {
      matchDetail: {},
      internalVisible: false,
      displayListChampion: false
    }
  },
  props: 
    ['runHandle']  
  ,
  methods: {
    async handleData(id: number, language: number) {
      const { data } = await MatchService.getOneMatch(id, 1);
      this.matchDetail = data
      this.internalVisible = true
    },
    closeDialog(){
      this.internalVisible = false
      store.state.displayPhao = false
    },
    displayList(){
      this.displayListChampion = true
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
</style>