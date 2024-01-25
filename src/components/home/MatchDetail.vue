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
    <div>
      <h3>Thông tin vị trí: </h3>
      Hạng 1: {{ matchDetail.rank_1 }}<br/>
      Hạng 2: {{ matchDetail.rank_2 }}<br/>
      Hạng 3: {{ matchDetail.rank_3 }}<br/>
      Hạng 4: {{ matchDetail.rank_4 }}<br/>
      Hạng 5: {{ matchDetail.rank_5 }}<br/>
      <h3>Thông tin tướng</h3>
      <el-row>
        <el-col :span="2"></el-col>
        <el-col :span="4">
          Danh sách tướng top: {{ matchDetail.champion_top }}
        </el-col>
        <el-col :span="4">
          Danh sách tướng mid: {{ matchDetail.champion_mid }}
        </el-col>
        <el-col :span="4">
          Danh sách tướng ad: {{ matchDetail.champion_ad }}
        </el-col>
        <el-col :span="4">
          Danh sách tướng jugle: {{ matchDetail.champion_jungle }}
        </el-col>
        <el-col :span="4">
          Danh sách tướng sp: {{ matchDetail.champion_sp }}
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
  
<script lang="ts">
import { ref } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { defineComponent } from 'vue'
import MatchService from '@/service/MatchService'

export default defineComponent({
  name: "MatchDetail",
  data() {
    return {
      matchDetail: {},
      internalVisible: false
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