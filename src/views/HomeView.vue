<template>
  <el-row class="home__row__container">
    <el-col :span="4"></el-col>
    <el-col :span="16">
      <el-button @click="clearFilter">Reset All Filters</el-button>
      <el-button @click="clearFilter">Run Start</el-button>
      <el-table ref="tableRef" row-key="id" :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="220"/>
        <el-table-column prop="date" label="Ngày" sortable width="220" column-key="date" :filters="[
          { text: '2016-05-01', value: '2016-05-01' },
          { text: '2016-05-02', value: '2016-05-02' },
          { text: '2016-05-03', value: '2016-05-03' },
          { text: '2016-05-04', value: '2016-05-04' },
        ]" :filter-method="filterHandler" />
        <el-table-column prop="author" label="Tác giả" width="220" />

        <el-table-column prop="result" label="Trạng thái" width="220" :filters="[
          { text: 'Thắng', value: 1 },
          { text: 'Thua', value: 2 },
          { text: 'Chưu diễn ra', value: 3 },
          { text: 'Đang đấu', value: 4 },
        ]" :filter-method="filterTag" filter-placement="bottom-end">
          <template #default="scope">
            <el-tag v-if="scope.row.result == 1" :type="'success'" disable-transitions>Thắng</el-tag>
            <el-tag v-if="scope.row.result == 2" :type="'error'" disable-transitions>Thua</el-tag>
            <el-tag v-if="scope.row.result == 3" :type="''" disable-transitions>Chưa diễn ra</el-tag>
            <el-tag v-if="scope.row.result == 4" :type="'warning'" disable-transitions>Đang đấu</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Option" >
          <el-button @click="getMatchById(1,1)"><el-icon><View /></el-icon>Chi tiết</el-button>
        </el-table-column>
      </el-table>
    </el-col>
    <el-col :span="4"></el-col>
  </el-row>
</template>

<script lang="ts" setup>



// TODO: improvement typing when refactor table


</script>


<script lang="ts">
import { defineComponent } from 'vue'
import MatchService from '@/service/MatchService'
import { ref } from 'vue'
import type { TableColumnCtx, TableInstance } from 'element-plus'
import { id } from 'element-plus/es/locale'

interface Match {
  id: number
  date: string
  author: string
  result: number
}
const tableRef = ref<TableInstance>()

export default defineComponent({
  name: "HomeView",
  data() {
    return {
      tableData: [],
      matchDetail: {}
    }
  },
  methods: {
    async getDataMatch() {
      const { data } = await MatchService.getAll(1);
      this.tableData = data
    },
    clearFilter() {
      tableRef.value!.clearFilter()
    },
    resetDateFilter() {
      tableRef.value!.clearFilter(['date'])
    },
    filterTag(value: number, row: Match) {
      return row.result === value
    },
    filterHandler(
      value: string,
      row: Match,
      column: TableColumnCtx<Match>
    ) {
      const property = column['property']
      return row[property] === value
    },
    async getMatchById(id : number, language : number){
      const { data } = await MatchService.getOneMatch(id,1);
      this.matchDetail = data
      console.log(this.matchDetail);
      
    }
  },
  mounted() {
    this.getDataMatch()
  },
})
</script>

<style lang="css">
.home__row__container {
  margin-top: 100px;
  min-height: 70vh
}
</style>