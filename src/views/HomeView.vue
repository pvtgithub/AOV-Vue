<template>
  <el-row class="home__row__container">
    <el-col :span="4"></el-col>
    <el-col :span="16">
      <el-button @click="dialogFormVisible = true" type="primary">
        {{ titleTable.random }}
      </el-button>

      <el-dialog v-model="dialogFormVisible" :title="titleTable.nameAuthorTitle" width="500">
        <p>{{ titleTable.nameAuthorPlace }}</p>
        <el-input v-model="nameAuthor" :disabled="true" />
        <template #footer>
          <span class="dialog-footer">
            <el-button type="danger" @click="dialogFormVisible = false">{{ titleTable.cancel }}</el-button>
            <el-button type="primary" @click="startRandom()">
              {{ titleTable.random }}
            </el-button>
          </span>
        </template>
      </el-dialog>
      <el-table ref="tableRef" row-key="id" :data="displayData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="170" />
        <el-table-column prop="date" :label="titleTable.date" sortable width="220" column-key="date" />
        <el-table-column prop="author" :label="titleTable.author" width="170" />
        <el-table-column prop="result" :label="titleTable.state" width="170" :filters="[
          { text: titleTable.win, value: 1 },
          { text: titleTable.lost, value: 2 },
          { text: titleTable.happening, value: 3 },
          { text: titleTable.not_happening, value: 4 },
        ]" :filter-method="filterTag" filter-placement="bottom-end">
          <template #default="scope">
            <el-tag class="cur_poiter" @click="changeState(scope.row.result, scope.row.id)" v-if="scope.row.result == 1"
              :type="'success'" disable-transitions>{{ titleTable.win }}</el-tag>
            <el-tag class="cur_poiter" @click="changeState(scope.row.result, scope.row.id)" v-if="scope.row.result == 2"
              :type="'danger'" disable-transitions>{{ titleTable.lost }}</el-tag>
            <el-tag class="cur_poiter" @click="changeState(scope.row.result, scope.row.id)" v-if="scope.row.result == 3"
              :type="''" disable-transitions>{{ titleTable.happening }}</el-tag>
            <el-tag class="cur_poiter" @click="changeState(scope.row.result, scope.row.id)" v-if="scope.row.result == 4"
              :type="'warning'" disable-transitions>{{ titleTable.not_happening
              }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="changePosition" :label="titleTable.change" width="170">
          <template #default="scope">
            <el-tag v-if="scope.row.changePosition == true" :type="'success'" disable-transitions>{{ titleTable.have_change }}</el-tag>
            <el-tag v-if="scope.row.changePosition == false" :type="'danger'" disable-transitions>{{ titleTable.no_change }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="titleTable.option" #default="scope">
          <el-button @click="getMatchById(scope.row.id, 1, true)">
            <el-icon>
              <View />
            </el-icon>{{ titleTable.detailButton }}
          </el-button>
          <el-popconfirm :title="titleTable.titleConfirmDelete" @confirm="deleteMatchById(scope.row.id)"
            @cancel="cancelEvent">
            <template #reference>
              <el-button type="danger">
                <el-icon>
                  <Delete />
                </el-icon>{{ titleTable.deleteButton }}
              </el-button>
            </template>
          </el-popconfirm>
        </el-table-column>
      </el-table>
      <el-divider></el-divider>

      <div style="text-align: center">
        <el-pagination background layout="prev, pager, next" @current-change="handleCurrentChangePage"
          :page-size="pageSize" :total="tableData.length">
        </el-pagination>
      </div>
      <el-divider></el-divider>
      <div v-if="displayPhao" class="pyro">
        <div class="before"></div>
        <div class="after"></div>
      </div>
      <MatchDetail @getMatchAgain="getDataMatch()" ref="runHandle" :id="idDetail" :languageValue="languageValue"/>
    </el-col>
    <el-col :span="4"></el-col>
  </el-row>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import MatchService from '@/service/MatchService'
import ChampionService from '@/service/ChampionService'
import { ref } from 'vue'
import { ElMessage, ElLoading, type TableInstance } from 'element-plus'
import MatchDetail from '@/components/home/MatchDetail.vue'
import store from '@/store/LanguageStore'
import { AllUtil } from '@/utils/allUtil'

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
      dialogFormVisible: ref(false),
      tableData: [],
      visible: false,
      displayPhao: false,
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
      nameAuthor: "",
      languageValue: 1,
      titleTable:
      {
        "id": 'ID',
        "date": "Ngày",
        "author": "Tác giả",
        "state": "Trạng thái",
        "change" : "Đổi đường",
        "option": "Lựa chọn",
        "random": "Bắt đầu quay tướng",
        "win": "Thắng",
        "lost": "Thua",
        "happening": "Đang đấu",
        "not_happening": "Chưa diễn ra",
        "have_change" : "Có đổi đường",
        "no_change" : "Không đổi đường",
        "detailButton": "Xem chi tiết",
        "deleteButton": "Xóa trận đấu",
        "titleConfirmDelete": "Bạn có muốn xóa trận đấu này?",
        "nameAuthorTitle": "Bắt đầu random?",
        "nameAuthorPlace": "Tên người quay:  ",
        "cancel": "Dừng lại",
        "success_change_state": "Đã cập nhật trạng thái trận đấu!"
      },
      exceptionChampion: [],
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
      data.forEach((element: any) => {
        element.date = AllUtil.timeToDateTimeFormat(element.date);
      });
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
    // filterHandler(
    //   value: string,
    //   row: Match,
    //   column: TableColumnCtx<Match>
    // ) {
    //   const property = column['property']
    //   return (row as any)[property] === value
    // },
    getMatchById(id: number, language: number, displayListChampion: boolean) {
      this.idDetail = id;
      (this.$refs['runHandle'] as any).handleData(id, language, displayListChampion)
    },
    async deleteMatchById(id: number) {
      await MatchService.deleteMatchById(id)
      ElMessage({
        showClose: true,
        message: `Đã xóa trận đấu ${id} !`,
        type: 'success',
      })
      this.getDataMatch()
    },
    startRandom() {
      if (this.nameAuthor == "") {
        ElMessage({
          showClose: true,
          message: 'Không nhập hoặc tên không đúng định dạng!',
          type: 'error',
        })
        this.dialogFormVisible = false
        return
      }
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        loading.close()
        var matchRandom = { "id": 0, "date": Date.now(), "author": "", "changePosition": false, "result": 0, "rank_1": "0", "rank_2": "", "rank_3": "", "rank_4": "", "rank_5": "", "champion_top": "", "champion_mid": "", "champion_jungle": "", "champion_ad": "", "champion_sp": "" };
        (this.randomedPosition as any) = this.randomPositon();
        matchRandom.id = Math.floor(Math.random() * 10000000)
        matchRandom.author = this.nameAuthor
        matchRandom.changePosition = false
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
                    console.log(matchRandom.champion_top);
                    
                    this.getDataMatch()
                    this.getMatchById(res.id, 1, false)
                    this.nameAuthor = store.state.payloadUser.name
                    this.dialogFormVisible = false
                    store.state.displayPhao = true
                  })
                })
              })
            })
          })
        })
      }, 1000)
    },
    cancelEvent() {
      console.log("cancel");
    },
    async getChampion(id: number, language: number) {
      return await ChampionService.getChampionById(id, language);
    },
    randomPositon() {
      const positions = ['Top', 'Mid', 'Rừng', 'Ad', 'Sp'];
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
    getFiveChampionFirst(randomedChampion: any) {
      var exceptionChampion: any[] = []
      for (let i = 4; i >= 0; i--) {
        const element = randomedChampion[i];
        exceptionChampion.push(element)
      }
      return exceptionChampion
    },
    handleChampion(idChampion: number, language: number): Promise<string> {
      return new Promise((resolve) => {
        this.getChampion(idChampion, language).then((result) => {
          let listChampion = "";
          var randomedChampion = []
          switch (idChampion) {
            case 1:
              randomedChampion = this.randomChampion(result.data.top);
              (this.exceptionChampion as any) = this.getFiveChampionFirst(randomedChampion);
              break;
            case 2:
              var filteredMid = result.data.mid.filter((itemB: { name: any }) => !this.exceptionChampion.some((itemA: { name: any }) => itemA.name === itemB.name));
              randomedChampion = this.randomChampion(filteredMid);
              var fiveChampionMid = this.getFiveChampionFirst(randomedChampion);
              fiveChampionMid.forEach(element => (this.exceptionChampion as any).push(element));
              break;
            case 3:
              var filteredJungle = result.data.jungle.filter((itemB: { name: any }) => !this.exceptionChampion.some((itemA: { name: any }) => itemA.name === itemB.name));
              randomedChampion = this.randomChampion(filteredJungle);
              var fiveChampionJungle = this.getFiveChampionFirst(randomedChampion);
              fiveChampionJungle.forEach(element => (this.exceptionChampion as any).push(element));
              break;
            case 4:
              var filteredAd = result.data.ad.filter((itemB: { name: any }) => !this.exceptionChampion.some((itemA: { name: any }) => itemA.name === itemB.name));
              randomedChampion = this.randomChampion(filteredAd);
              var fiveChampionAd = this.getFiveChampionFirst(randomedChampion);
              fiveChampionAd.forEach(element => (this.exceptionChampion as any).push(element));
              break;
            case 5:
              var filteredSp = result.data.sp.filter((itemB: { name: any }) => !this.exceptionChampion.some((itemA: { name: any }) => itemA.name === itemB.name));
              randomedChampion = this.randomChampion(filteredSp);
              var fiveChampionSp = this.getFiveChampionFirst(randomedChampion);
              fiveChampionSp.forEach(element => (this.exceptionChampion as any).push(element));
              break;
            default:
              break;
          }

          for (let index = 0; index < randomedChampion.length; index++) {
            const element = randomedChampion[index];
            if (index == randomedChampion.length - 1) {
              listChampion += element.name;
              break;
            }
            listChampion += element.name + ',';
          }

          resolve(listChampion);
        });
      });
    },
    handleCurrentChangePage(val: number) {
      this.page = val
    },
    changeState(state: number, id: number) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        if (state == 4) {
          state = 1
        } else {
          state++
        }
        MatchService.updateState(id, state).then(() => {
          ElMessage({
            showClose: true,
            message: this.titleTable.success_change_state,
            type: 'success',
          })
          this.getDataMatch()
        }).catch(() => {
          ElMessage({
            showClose: true,
            message: `Có lỗi xảy ra!`,
            type: 'error',
          })
        })
        loading.close()
      }, 300);
    },
    changeLanguage() {
      if (this.languageValue == 1) {
        this.titleTable.date = "Ngày quay"
        this.titleTable.author = "Người quay"
        this.titleTable.state = "Trạng thái"
        this.titleTable.change = "Đổi đường"
        this.titleTable.option = "Lựa chọn"
        this.titleTable.random = "Bắt đầu quay tướng"
        this.titleTable.win = "Thắng"
        this.titleTable.lost = "Thua"
        this.titleTable.happening = "Đang đấu"
        this.titleTable.not_happening = "Chưa diễn ra"
        this.titleTable.have_change = "Có đổi đường"
        this.titleTable.no_change = "Không đổi đường"
        this.titleTable.detailButton = "Xem chi tiết"
        this.titleTable.deleteButton = "Xóa trận đấu"
        this.titleTable.titleConfirmDelete = "Bạn có muốn xóa trận đấu này?"
        this.titleTable.nameAuthorTitle = "Bắt đầu random?"
        this.titleTable.nameAuthorPlace = "Tên người quay:  ",
        this.titleTable.cancel = "Dừng lại",
        this.titleTable.success_change_state = "Đã cập nhật trạng thái trận đấu!"
      } else if (this.languageValue == 2) {
        this.titleTable.date = "Date"
        this.titleTable.author = "Author"
        this.titleTable.state = "State"
        this.titleTable.change = "Change Position"
        this.titleTable.option = "Option"
        this.titleTable.random = "Random"
        this.titleTable.win = "Win"
        this.titleTable.lost = "Lost"
        this.titleTable.happening = "Happening"
        this.titleTable.not_happening = "Has't happening yet"
        this.titleTable.have_change = "Changed"
        this.titleTable.no_change = "Not changing"
        this.titleTable.detailButton = "Detail"
        this.titleTable.deleteButton = "Delete"
        this.titleTable.titleConfirmDelete = "Are you sure you want to delete match?"
        this.titleTable.nameAuthorTitle = "Start random match?"
        this.titleTable.nameAuthorPlace = "Input author name:",
        this.titleTable.cancel = "Cancel",
        this.titleTable.success_change_state = "Updated match successfuly!"
      } else if (this.languageValue == 3) {
        this.titleTable.date = "日"
        this.titleTable.author = "著者"
        this.titleTable.state = "状態"
        this.titleTable.change = "ルート変更"
        this.titleTable.option = "選択する"
        this.titleTable.random = "振り向く"
        this.titleTable.win = "勝つ"
        this.titleTable.lost = "失う"
        this.titleTable.happening = "起こっている"
        this.titleTable.not_happening = "まだ起こっていない"
        this.titleTable.have_change = "ルート変更あり"
        this.titleTable.no_change = "変更なし"
        this.titleTable.detailButton = "詳細を見る"
        this.titleTable.deleteButton = "一致を削除"
        this.titleTable.titleConfirmDelete = "この一致を削除しますか?"
        this.titleTable.nameAuthorTitle = "回転を開始します?"
        this.titleTable.nameAuthorPlace = "撮影者の名前を入力してください:",
        this.titleTable.cancel = "停止",
        this.titleTable.success_change_state = "試合状況を更新しました！"
      }
    }
  },
  mounted() {
    this.languageValue = store.state.language
    this.displayPhao = store.state.displayPhao
    store.dispatch('updatePayloadUser')
    this.nameAuthor = store.state.payloadUser.name
    this.changeLanguage()

    store.watch(
      state => state.language,
      newValue => {
        this.languageValue = newValue
        this.changeLanguage()
      }
    )
    store.watch(
      state => state.displayPhao,
      newValue => {
        this.displayPhao = newValue
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

/* phao hoa */
.pyro {
  position: fixed;
  top: 220px;
  left: 50%;
  z-index: 2044;
}

.pyro>.before,
.pyro>.after {
  position: absolute;
  width: 7px;
  height: 7px;
  pointer-events: none;
  z-index: 99999999;
  border-radius: 50%;
  box-shadow: -120px -218.66667px blue, 248px -16.66667px #00ff84, 190px 16.33333px #002bff, -113px -308.66667px #ff009d, -109px -287.66667px #ffb220, -50px -313.66667px #ff006e, 226px -31.66667px #ff4000, 180px -351.66667px #ff00d0, -12px -338.66667px #00f6ff, 220px -388.66667px #99ff00, -69px -27.66667px #ff0400, -111px -339.66667px #6220ff, 155px -237.66667px #00ddff, -152px -380.66667px #00ffd0, -50px -37.66667px #00ffdd, -95px -175.66667px #a6ff00, -88px 10.33333px #0d00ff, 112px -309.66667px #005eff, 69px -415.66667px #ff00a6, 168px -100.66667px #ff004c, -244px 24.33333px #ff6600, 97px -325.66667px #ff0066, -211px -182.66667px #00ffa2, 236px -126.66667px #b700ff, 140px -196.66667px #9000ff, 125px -175.66667px #00bbff, 118px -381.66667px #ff002f, 144px -111.66667px #ffae00, 36px -78.66667px #f600ff, -63px -196.66667px #c800ff, -218px -227.66667px #d4ff00, -134px -377.66667px #ea00ff, -36px -412.66667px #ff00d4, 209px -106.66667px #00fff2, 91px -278.66667px #000dff, -22px -191.66667px #9dff00, 139px -392.66667px #a6ff00, 56px -2.66667px #0099ff, -156px -276.66667px #ea00ff, -163px -233.66667px #00fffb, -238px -346.66667px #00ff73, 62px -363.66667px #0088ff, 244px -170.66667px #0062ff, 224px -142.66667px #b220ff, 141px -208.66667px #9000ff, 211px -285.66667px #ff6600, 181px -128.66667px #1e00ff, 90px -123.66667px #c800ff, 189px 70.33333px #00ffc8, -18px -383.66667px #00ff33, 100px -6.66667px #ff008c;
  -moz-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
  -webkit-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
  -o-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
  -ms-animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
  animation: 1s bang ease-out infinite backwards, 1s gravity ease-in infinite backwards, 5s position linear infinite backwards;
}

.pyro>.after {
  -moz-animation-delay: 1.25s, 1.25s, 1.25s;
  -webkit-animation-delay: 1.25s, 1.25s, 1.25s;
  -o-animation-delay: 1.25s, 1.25s, 1.25s;
  -ms-animation-delay: 1.25s, 1.25s, 1.25s;
  animation-delay: 1.25s, 1.25s, 1.25s;
  -moz-animation-duration: 1.25s, 1.25s, 6.25s;
  -webkit-animation-duration: 1.25s, 1.25s, 6.25s;
  -o-animation-duration: 1.25s, 1.25s, 6.25s;
  -ms-animation-duration: 1.25s, 1.25s, 6.25s;
  animation-duration: 1.25s, 1.25s, 6.25s;
}

@-webkit-keyframes bang {
  from {
    box-shadow: 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white;
  }
}

@-moz-keyframes bang {
  from {
    box-shadow: 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white;
  }
}

@-o-keyframes bang {
  from {
    box-shadow: 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white;
  }
}

@-ms-keyframes bang {
  from {
    box-shadow: 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white;
  }
}

@keyframes bang {
  from {
    box-shadow: 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white, 0 0 white;
  }
}

@-webkit-keyframes gravity {
  to {
    transform: translateY(220px);
    -moz-transform: translateY(220px);
    -webkit-transform: translateY(220px);
    -o-transform: translateY(220px);
    -ms-transform: translateY(220px);
    opacity: 0;
  }
}

@-moz-keyframes gravity {
  to {
    transform: translateY(220px);
    -moz-transform: translateY(220px);
    -webkit-transform: translateY(220px);
    -o-transform: translateY(220px);
    -ms-transform: translateY(220px);
    opacity: 0;
  }
}

@-o-keyframes gravity {
  to {
    transform: translateY(220px);
    -moz-transform: translateY(220px);
    -webkit-transform: translateY(220px);
    -o-transform: translateY(220px);
    -ms-transform: translateY(220px);
    opacity: 0;
  }
}

@-ms-keyframes gravity {
  to {
    transform: translateY(220px);
    -moz-transform: translateY(220px);
    -webkit-transform: translateY(220px);
    -o-transform: translateY(220px);
    -ms-transform: translateY(220px);
    opacity: 0;
  }
}

@keyframes gravity {
  to {
    transform: translateY(220px);
    -moz-transform: translateY(220px);
    -webkit-transform: translateY(220px);
    -o-transform: translateY(220px);
    -ms-transform: translateY(220px);
    opacity: 0;
  }
}

@-webkit-keyframes position {

  0%,
  19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }

  20%,
  39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }

  40%,
  59.9% {
    margin-top: 20%;
    margin-left: 70%;
  }

  60%,
  79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }

  80%,
  99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}

@-moz-keyframes position {

  0%,
  19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }

  20%,
  39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }

  40%,
  59.9% {
    margin-top: 20%;
    margin-left: 70%;
  }

  60%,
  79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }

  80%,
  99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}

@-o-keyframes position {

  0%,
  19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }

  20%,
  39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }

  40%,
  59.9% {
    margin-top: 20%;
    margin-left: 70%;
  }

  60%,
  79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }

  80%,
  99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}

@-ms-keyframes position {

  0%,
  19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }

  20%,
  39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }

  40%,
  59.9% {
    margin-top: 20%;
    margin-left: 70%;
  }

  60%,
  79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }

  80%,
  99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}

@keyframes position {

  0%,
  19.9% {
    margin-top: 10%;
    margin-left: 40%;
  }

  20%,
  39.9% {
    margin-top: 40%;
    margin-left: 30%;
  }

  40%,
  59.9% {
    margin-top: 20%;
    margin-left: 70%;
  }

  60%,
  79.9% {
    margin-top: 30%;
    margin-left: 20%;
  }

  80%,
  99.9% {
    margin-top: 30%;
    margin-left: 80%;
  }
}

.el-tag.cur_poiter:hover {
  cursor: pointer;
}
</style>