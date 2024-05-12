<template>
  <v-container class="custom-width">
    <v-overlay :model-value="loading" class="align-center justify-center">
      <v-progress-circular color="primary" size="64" indeterminate></v-progress-circular>
      <div justify="center"><h3>loading...</h3></div>
    </v-overlay>
    <v-card class="mb-4">
      <v-img
        class="mx-auto"
        height="180"
        aspect-ratio="16/9"
        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
        cover
      >
      </v-img>
      <v-card-title>
        <h3>{{ year }}年 {{ month }}月 主任ヒアリング 事前アンケート</h3>
      </v-card-title>
      <v-card-text class="pre-wrap">{{ constVal.MAIN_TEXT }}</v-card-text>
      <!-- <div class="sub-title mt-4">新入社員(カリキュラム対象)</div>
      <v-radio-group v-model="curriculum" inline required>
        <div class="ml-4">
          <v-radio label="対象ではない" value="0"></v-radio>
          <v-radio label="対象" value="1"></v-radio>
        </div>
      </v-radio-group> -->
    </v-card>
    <v-form ref="validateForm" :key="formKey" lazy-validation>
      <v-card class="mb-4">
        <v-card-title>
          <h4>お名前（選択してください）</h4>
        </v-card-title>
        <v-col cols="4">
          <v-select
            label="お名前"
            v-model="selectedUser"
            variant="outlined"
            :items="userSelect"
            :rules="inputRules.selectedUser"
            required
          >
          </v-select>
        </v-col>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          <h4>現場の状況（技術的な部分をメインで）</h4>
        </v-card-title>
        <v-col cols="12">
          <v-divider class="border-opacity-25"></v-divider>
        </v-col>
        <div class="sub-title">プロジェクト名 <span class="required-mark">※</span></div>
        <v-col cols="7">
          <v-text-field
            v-model="projectName"
            label="内容"
            :rules="inputRules.projectName"
            required
          ></v-text-field>
        </v-col>
        <div class="sub-title">作業内容 <span class="required-mark">※</span></div>
        <v-col cols="7">
          <v-textarea
            v-model="workDetail"
            label="内容"
            :rules="inputRules.workDetail"
            required
          ></v-textarea>
        </v-col>
        <div class="sub-title">遅延有無 <span class="required-mark">※</span></div>
        <v-radio-group
          v-model="deferredExistence"
          inline
          :rules="inputRules.deferredExistence"
          required
        >
          <div class="ml-4">
            <v-radio label="ある" value="ある"></v-radio>
            <v-radio label="ない" value="ない"></v-radio>
          </div>
        </v-radio-group>
        <div class="sub-title">現場からの指摘有無 <span class="required-mark">※</span></div>
        <v-col cols="7">
          <v-textarea
            v-model="pointingOut"
            label="内容"
            :rules="inputRules.pointingOut"
            required
          ></v-textarea>
        </v-col>
        <div class="sub-title">稼働状況（現時点）<span class="required-mark">※</span></div>
        <v-col cols="7">
          <v-text-field
            v-model="workingStatus"
            label="内容"
            :rules="inputRules.workingStatus"
            required
          ></v-text-field>
        </v-col>
        <div class="sub-title">
          コミュニケーションは問題なく取れているか <span class="required-mark">※</span>
        </div>
        <v-col cols="7">
          <v-textarea
            v-model="communication"
            label="内容"
            :rules="inputRules.communication"
            required
          ></v-textarea>
        </v-col>
        <div class="sub-title">
          現場で困っていることなどがあれば <span class="required-mark">※</span>
        </div>
        <v-col cols="7">
          <v-textarea
            v-model="inTrouble"
            label="内容"
            :rules="inputRules.inTrouble"
            required
          ></v-textarea>
        </v-col>
        <div class="sub-title">
          今後やってみたい案件とその理由 <span class="required-mark">※</span>
        </div>
        <v-col cols="7">
          <v-textarea
            v-model="nextProject"
            label="内容"
            :rules="inputRules.nextProject"
            required
          ></v-textarea>
        </v-col>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          <h4>その他、意見や要望</h4>
        </v-card-title>
        <v-col cols="12">
          <v-divider class="border-opacity-25"></v-divider>
        </v-col>
        <div class="sub-title">
          自身で現在取り組んでいること <span class="required-mark">※</span>
        </div>
        <v-col cols="7">
          <v-textarea
            v-model="initiatives"
            label="内容"
            :rules="inputRules.initiatives"
            required
          ></v-textarea>
        </v-col>
        <div class="sub-title">会社に対する意見・要望 <span class="required-mark">※</span></div>
        <v-col cols="7">
          <v-textarea
            v-model="opinion"
            label="内容"
            :rules="inputRules.opinion"
            required
          ></v-textarea>
        </v-col>
      </v-card>
      <v-card class="mb-4">
        <v-card-title>
          <h4>ヒアリングスケジュール予約</h4>
        </v-card-title>
        <template v-if="initialEventsReady">
          <CalenderApp :calendarList="initialEvents" />
        </template>
        <v-row class="ml-4">
          <v-col cols="4">
            <v-select
              clearable
              label="日付"
              v-model="selectedMeetingDay"
              :items="meetingDays"
              :rules="inputRules.meetingDays"
              variant="outlined"
              required
            >
            </v-select>
          </v-col>
          <v-col cols="4">
            <v-select
              clearable
              label="時間"
              v-model="selectedMeetingTime"
              :items="meetingTimes"
              :rules="inputRules.meetingTimes"
              variant="outlined"
              required
            >
            </v-select>
          </v-col>
        </v-row>
        <v-col>
          <div
            class="required-mark ml-4"
            v-if="selectedMeetingDay === null || selectedMeetingTime === null"
          >
            {{ meetingInfo }}
          </div>
          <div v-else class="ml-4">選択したヒアリング日程：{{ meetingInfo }}</div>
        </v-col>
      </v-card>
    </v-form>
    <v-btn color="primary" size="large" variant="elevated" @click.stop="toggleDialog"> 提出 </v-btn>
    <v-btn class="mx-3" color="secondary" size="large" variant="elevated" @click="handleClear">
      クリア
    </v-btn>
  </v-container>
  <DialogApp :dialog="dialogFlg" @setHandleSubmit="handleSubmit" @closeDialog="handleDialogClose" />
</template>

<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { constVal } from '@/const/index.js'
import { request } from '../api/utils'
import { useToast } from 'vue-toast-notification'
import { formatInTimeZone } from 'date-fns-tz'
import CalenderApp from '@/components/CalenderApp.vue'
import DialogApp from '@/components/DialogApp.vue'

// toast
const $toast = useToast()

// ローディング状態の追加
const loading = ref(true)

// validate
const validateForm = ref(null)
// フォームの再レンダリング用キー
const formKey = ref(0)

// const curriculum = ref('0')
const year = ref(new Date().getFullYear())
const month = ref(new Date().getMonth() + 1)
const projectName = ref('')
const workDetail = ref('')
const deferredExistence = ref('')
const pointingOut = ref('')
const workingStatus = ref('')
const communication = ref('')
const inTrouble = ref('')
const nextProject = ref('')
const initiatives = ref('')
const opinion = ref('')

// calendar
const eventGuid = ref(0)
const initialEventsReady = ref(false) // 初期イベントデータが準備完了したかどうかのフラグ
const initialEvents = ref([])
const calendarData = ref([])
const selectedMeetingDay = ref(null)
const selectedMeetingTime = ref(null)

// dialog
const dialogFlg = ref(false)

// userName
const userSelect = ref([])
const selectedUser = ref('')

// ヒアリング日付
const meetingDays = ref([])
// ヒアリング時間
const meetingTimes = ref([])

// 入力必須のルール
const requiredRule = (val) => !!val || '入力してください。'

// 各入力フィールド用のルール
const inputRules = reactive({
  projectName: [requiredRule],
  workDetail: [requiredRule],
  deferredExistence: [requiredRule],
  pointingOut: [requiredRule],
  workingStatus: [requiredRule],
  communication: [requiredRule],
  inTrouble: [requiredRule],
  nextProject: [requiredRule],
  initiatives: [requiredRule],
  opinion: [requiredRule],
  selectedUser: [requiredRule],
  selectedMeetingDay: [requiredRule],
  selectedMeetingTime: [requiredRule]
})

const meetingInfo = computed(() => {
  if (selectedMeetingDay.value === null || selectedMeetingTime.value === null) {
    return constVal.METTING_SCHEDULE_EMPTY
  } else {
    return selectedMeetingDay.value + '　' + selectedMeetingTime.value
  }
})

const toggleDialog = () => {
  dialogFlg.value = !dialogFlg.value
}

const handleDialogClose = () => {
  dialogFlg.value = false
}

// 提出
const handleSubmit = async () => {
  handleDialogClose()
  loading.value = true

  // validate check
  if (validateForm.value) {
    const validationResult = await validateForm.value.validate()

    // validationResult が false の場合、エラーメッセージを表示
    if (!validationResult.valid) {
      $toast.error('入力漏れがあります')
      validateForm.value.resetValidation()
      loading.value = false
      return false
    }
  }

  // 登録パラメータ設定
  const payload = {
    selectedUser: selectedUser.value,
    selectedMeetingDay: selectedMeetingDay.value,
    selectedMeetingTime: selectedMeetingTime.value,
    projectName: projectName.value,
    workDetail: workDetail.value,
    deferredExistence: deferredExistence.value,
    pointingOut: pointingOut.value,
    workingStatus: workingStatus.value,
    communication: communication.value,
    inTrouble: inTrouble.value,
    nextProject: nextProject.value,
    initiatives: initiatives.value,
    opinion: opinion.value
  }
  // スケジュール登録API
  const getScheduleResponse = await request('apiSetSchedule', payload)
  if (!getScheduleResponse.call) {
    $toast.error(getScheduleResponse.message)
    loading.value = false
    return false
  }

  // 提出API
  const registerResult = await request('registerDataSheet', payload)
  if (!registerResult.call) {
    $toast.error(registerResult.message)
    loading.value = false
    return false
  }
  initialEventsReady.value = false
  await clearItem()
  await initData()
  loading.value = false
  $toast.success(registerResult.message)
}

const handleClear = async () => {
  await clearItem()

  $toast.success('クリアしました。')
}

const clearItem = async () => {
  userSelect.value = []
  selectedUser.value = ''
  projectName.value = ''
  workDetail.value = ''
  deferredExistence.value = ''
  pointingOut.value = ''
  workingStatus.value = ''
  communication.value = ''
  inTrouble.value = ''
  nextProject.value = ''
  initiatives.value = ''
  opinion.value = ''
  selectedMeetingDay.value = null
  selectedMeetingTime.value = null

  // フォームのバリデーション状態をリセット
  if (validateForm.value) {
    validateForm.value.resetValidation()
  }

  // フォームを再レンダリングするためにコンポーネントキーを更新
  formKey.value++
}

const initData = async () => {
  try {
    // 社員リスト取得
    const getUserNameList = await request('apiSetUserName')
    userSelect.value = getUserNameList.data
    // ヒアリング日付リスト取得
    const getMeetingDays = await request('apiGetMeetingDays')
    meetingDays.value = getMeetingDays.data
    // ヒアリング時間リスト取得
    const getMeetingTimes = await request('apiGetMeetingTimes')
    meetingTimes.value = getMeetingTimes.data
    // カレンダーデータ取得
    const getCalendarDate = await request('getCalendarDataBySheet')
    calendarData.value = getCalendarDate.data
    if (!getCalendarDate.call) {
      $toast.error(getCalendarDate.message)
      return false
    }
    const timeZone = 'Asia/Tokyo' // 日本のタイムゾーンを指定

    initialEvents.value = calendarData.value.map((item) => {
      const [startTime, endTime] = item.timeRange.split(' ~ ')
      const formattedTimeStart = `T${startTime}:00`
      const formattedTimeEnd = `T${endTime}:00`

      const [datePart] = item.date.split(' ')
      const formattedDate = formatInTimeZone(new Date(datePart), timeZone, 'yyyy-MM-dd')

      return {
        id: createEventId(),
        title: item.userName,
        start: formattedDate + formattedTimeStart,
        end: formattedDate + formattedTimeEnd
      }
    })
    initialEventsReady.value = true

    // 1秒待機後にローディングを解除
    setTimeout(() => {
      loading.value = false
    }, 1000)
  } catch (error) {
    $toast.error('データの取得中にエラーが発生しました' + '<br>' + error)
    // 1秒待機後にローディングを解除
    setTimeout(() => {
      loading.value = false
    }, 1000)
  }
}

function createEventId() {
  return String(eventGuid.value++)
}

onMounted(async () => {
  // init処理
  await initData()
})
</script>

<style scoped>
.pre-wrap {
  white-space: pre-wrap;
}
.sub-title {
  margin-left: 15px;
}
.required-mark {
  color: red;
}
.custom-width {
  max-width: 960px; /* 任意の最大幅を指定 */
}
</style>
