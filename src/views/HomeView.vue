<template>
  <el-row class="home__row__container">
    <el-col :span="4"></el-col>
    <el-col :span="16">
      <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="#626AEF"
        title="Bắt đầu random tướng?" @confirm="startRandom" @cancel="cancelEvent">
        <template #reference>
          <el-button type="primary">{{ titleTable.random }}</el-button>
        </template>
      </el-popconfirm>
      <el-table ref="tableRef" row-key="id" :data="displayData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="220" />
        <el-table-column prop="date" :label="titleTable.date" sortable width="220" column-key="date" />
        <el-table-column prop="author" :label="titleTable.author" width="220" />
        <el-table-column prop="result" :label="titleTable.state" width="220" :filters="[
          { text: 'Thắng', value: 1 },
          { text: 'Thua', value: 2 },
          { text: 'Chưu diễn ra', value: 3 },
          { text: 'Đang đấu', value: 4 },
        ]" :filter-method="filterTag" filter-placement="bottom-end">
          <template #default="scope">
            <el-tag v-if="scope.row.result == 1" :type="'success'" disable-transitions>{{ titleTable.win }}</el-tag>
            <el-tag v-if="scope.row.result == 2" :type="'error'" disable-transitions>{{ titleTable.lost }}</el-tag>
            <el-tag v-if="scope.row.result == 3" :type="''" disable-transitions>{{ titleTable.happening }}</el-tag>
            <el-tag v-if="scope.row.result == 4" :type="'warning'" disable-transitions>{{ titleTable.not_happening }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="titleTable.option" #default="scope">
          <el-button @click="getMatchById(scope.row.id, 1)"><el-icon>
              <View />
            </el-icon>Chi tiết</el-button>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>

      <div style="text-align: center">
        <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChangePage"
          :page-size="pageSize" :total="tableData.length">
        </el-pagination>
      </div>
      <el-divider></el-divider>

      <MatchDetail ref="runHandle" :id="idDetail" />
    </el-col>
    <el-col :span="4"></el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MatchService from '@/service/MatchService'
import ChampionService from '@/service/ChampionService'
import { ref } from 'vue'
import type { TableColumnCtx, TableInstance } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import MatchDetail from '@/components/home/MatchDetail.vue'
import store from '@/store/LanguageStore'

interface Match {
  id: number
  date: string
  author: string
  result: number,
  rank_1: string,
  rank_2: string,
  rank_3: string,
  rank_4: string,
  rank_5: string,
  champion_top: string,
  champion_mid: string,
  champion_jungle: string,
  champion_ad: string,
  champion_sp: string,
}
const tableRef = ref<TableInstance>()

export default defineComponent({
  name: "HomeView",
  components: {
    MatchDetail
  },
  data() {
    return {
      tableData: [],
      visible: false,
      idDetail: 1,
      randomedPosition: [],
      randomedChampion: [],
      championTop: [],
      championMid: [],
      championJungle: [],
      championAd: [],
      championSp: [],
      filtered: [],
      search: '',
      page: 1,
      pageSize: 10,
      total: 0,
      languageValue: 1,
      titleTable:
      {
        "id": 'ID',
        "date": "Ngày",
        "author": "Tác giả",
        "state": "Trạng thái",
        "option": "Lựa chọn",
        "random": "Bắt đầu quay",
        "win": "Thắng",
        "lost": "Thua",
        "happening": "Đang đấu",
        "not_happening": "Chưa diễn ra"
      },

    }
  },
  computed: {
    displayData(): any {
      if (!this.tableData || this.tableData.length === 0) return [];
      return this.tableData.slice(this.pageSize * this.page - this.pageSize, this.pageSize * this.page)
    }
  },
  methods: {
    async getDataMatch() {
      const { data } = await MatchService.getAll(1);
      this.tableData = data
    },
    async postMatch(match: any) {
      const { data } = await MatchService.postMatch(match)
      return data
    },
    clearFilter() {
      this.getDataMatch()
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
      return (row as any)[property] === value
    },
    getMatchById(id: number, language: number) {
      this.idDetail = id;
      (this.$refs['runHandle'] as any).handleData(id, language)
    },
    startRandom() {
      var matchRandom = { "id": 0, "date": "", "author": "", "result": 0, "rank_1": "0", "rank_2": "", "rank_3": "", "rank_4": "", "rank_5": "", "champion_top": "", "champion_mid": "", "champion_jungle": "", "champion_ad": "", "champion_sp": "" };
      (this.randomedPosition as any) = this.randomPositon();
      var today = new Date();
      var dateCurent = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
      matchRandom.id = Math.floor(Math.random() * 10000000)
      matchRandom.date = dateCurent
      matchRandom.author = "Admin"
      matchRandom.result = 3
      matchRandom.rank_1 = this.randomedPosition[0]
      matchRandom.rank_2 = this.randomedPosition[1]
      matchRandom.rank_3 = this.randomedPosition[2]
      matchRandom.rank_4 = this.randomedPosition[3]
      matchRandom.rank_5 = this.randomedPosition[4]

      this.handleChampion(1, 1).then((res) => {
        matchRandom.champion_top = res
        this.handleChampion(2, 1).then((res) => {
          matchRandom.champion_mid = res
          this.handleChampion(3, 1).then((res) => {
            matchRandom.champion_jungle = res
            this.handleChampion(4, 1).then((res) => {
              matchRandom.champion_ad = res
              this.handleChampion(5, 1).then((res) => {
                matchRandom.champion_sp = res
                this.postMatch(matchRandom).then((res) => {
                  this.getDataMatch()
                  this.getMatchById(res.id, 1)
                })
              })
            })
          })
        })
      })
    },
    cancelEvent() {
      console.log("cancel");
    },
    async getChampion(id: number, language: number) {
      return await ChampionService.getChampionById(id, language);
    },
    randomPositon() {
      const positions = ['Top', 'Mid', 'Jungle', 'ADC', 'Sp'];
      const randomizedPositions = [];

      while (positions.length > 0) {
        const randomIndex = Math.floor(Math.random() * positions.length);
        const randomPosition = positions.splice(randomIndex, 1)[0];
        randomizedPositions.push(randomPosition);
      }
      return randomizedPositions
    },
    randomChampion(arrChampion: any[]) {
      const randomizedChampion = [];
      while (arrChampion.length > 0) {
        const randomIndex = Math.floor(Math.random() * arrChampion.length);
        const randomChampion = arrChampion.splice(randomIndex, 1)[0];
        randomizedChampion.push(randomChampion);
        if (randomizedChampion.length == 10) {
          break;
        }
      }
      return randomizedChampion;
    },
    handleChampion(idChampion: number, language: number): Promise<string> {
      return new Promise((resolve, reject) => {
        this.getChampion(idChampion, language).then((result) => {
          let listChampion = "";
          var randomedChampion = []
          switch (idChampion) {
            case 1:
              randomedChampion = this.randomChampion(result.data.top);
              break;
            case 2:
              randomedChampion = this.randomChampion(result.data.mid);
              break;
            case 3:
              randomedChampion = this.randomChampion(result.data.jungle);
              break;
            case 4:
              randomedChampion = this.randomChampion(result.data.ad);
              break;
            case 5:
              randomedChampion = this.randomChampion(result.data.sp);
              break;
            default:
              break;
          }

          randomedChampion.forEach((element: any) => {
            listChampion += element.name + ' ';
          });

          resolve(listChampion);
        });
      });
    },
    handleCurrentChangePage(val: number) {
      this.page = val
    },
    changeLanguage() {
      if (this.languageValue == 1) {
        this.titleTable.date = "Ngày"
        this.titleTable.author = "Tác giả"
        this.titleTable.state = "Trạng thái"
        this.titleTable.option = "Lựa chọn"
        this.titleTable.random = "Bắt đầu quay"
        this.titleTable.win = "Thắng"
        this.titleTable.lost = "Thua"
        this.titleTable.happening = "Đang đấu"
        this.titleTable.not_happening = "Chưa diễn ra"
      } else if (this.languageValue == 2) {
        this.titleTable.date = "Date"
        this.titleTable.author = "Author"
        this.titleTable.state = "State"
        this.titleTable.option = "Option"
        this.titleTable.random = "Random"
        this.titleTable.win = "Win"
        this.titleTable.lost = "Lost"
        this.titleTable.happening = "Happening"
        this.titleTable.not_happening = "Has't happening yet"
      } else if (this.languageValue == 3) {
        this.titleTable.date = "日"
        this.titleTable.author = "著者"
        this.titleTable.state = "状態"
        this.titleTable.option = "選択する"
        this.titleTable.random = "振り向く"
        this.titleTable.win = "勝つ"
        this.titleTable.lost = "失う"
        this.titleTable.happening = "起こっている"
        this.titleTable.not_happening = "まだ起こっていない"
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
    this.getDataMatch()
  }
})
</script>

<style lang="css">
.home__row__container {
  min-height: 70vh
}

.el-table tr,
.el-table th.el-table__cell {
  font-size: var(--fontsize-normal)
}

.dark__mode .el-table tr,
.dark__mode .el-table th.el-table__cell {
  background-color: var(--color-background-darkmode);
  color: var(--color-text);
}
</style>