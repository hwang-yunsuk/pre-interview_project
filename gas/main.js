/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const CONFIG = {
  TITLE: 'pre-interview_project'
}

function doGet(e) {
  return HtmlService.createTemplateFromFile('index.html')
    .evaluate()
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle(CONFIG.TITLE)
}

function includes(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent()
}

// 回答者対象リスト取得
function apiSetUserName() {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')
  // A2セルから最後のデータのあるセルまでの範囲を取得
  const range = ss.getRange('A2:A' + ss.getLastRow()).getValues()
  // 二次元配列を一次元配列に変換
  const userNameList = range.map((row) => row[0])
  return JSON.stringify({
    data: userNameList,
    call: true,
    message: 'get UserNameList'
  })
}

// ヒアリング日付を取得
function apiGetMeetingDays() {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  const range = ss.getRange('A2:A' + ss.getLastRow()).getValues()
  let scheduleDays = []

  // 二次元配列をループして、空のデータが見つかったらループを終了
  for (let i = 0; i < range.length; i++) {
    if (range[i][0] === '') {
      break // 空のデータを検出したら、追加を停止
    }
    scheduleDays.push(range[i][0])
  }

  return JSON.stringify({
    data: scheduleDays,
    call: true,
    message: 'get scheduleDays'
  })
}

// ヒアリング時間を取得
function apiGetMeetingTimes() {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  // B1セルから最後の行まであるセルまでの範囲を取得
  const lastColumn = ss.getLastColumn()
  const range = ss.getRange('B1:' + String.fromCharCode(64 + lastColumn) + '1').getValues()

  // 二次元配列を一次元配列に変換
  const scheduleTimes = range[0]
  return JSON.stringify({
    data: scheduleTimes,
    call: true,
    message: 'get scheduleTimes'
  })
}

// Schedule登録処理
function apiSetSchedule(payload) {
  payload = JSON.parse(payload)
  // ヒアリング日程登録処理
  const meetingDay = payload.selectedMeetingDay
  const meetingTime = payload.selectedMeetingTime
  const userName = payload.selectedUser

  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)

  // 日付と時間に一致するセルを検索
  const dateColumn = ss.getRange('A:A').getValues().flat().indexOf(meetingDay) + 1
  const timeRow = ss.getRange('1:1').getValues()[0].indexOf(meetingTime) + 1

  // 日付と時間が見つからない場合は終了
  if (dateColumn === 0 || timeRow === 0) {
    return JSON.stringify({
      call: false,
      message: '指定された日付または時間が見つかりませんでした。'
    })
  }

  // カラムにすでに登録されているかチェック
  const cellValue = ss.getRange(dateColumn, timeRow).getValue()
  if (cellValue !== '') {
    return JSON.stringify({
      call: false,
      message: '選択した日付または時間はすでに登録されています。'
    })
  }

  const isExist = isUserNameRegisteredInRange(userName, dateColumn, timeRow)
  if (isExist) {
    return JSON.stringify({
      call: false,
      message: 'お名前はすでに登録されています。'
    })
  }

  // 登録処理
  const result = ss.getRange(dateColumn, timeRow).setValue(userName)

  return JSON.stringify({
    data: result,
    call: true,
    message: '登録完了しました。'
  })
}

// inputDataシートにデータを登録する
function registerDataSheet(payload) {
  payload = JSON.parse(payload)

  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName('inputData')

  // 登録するデータ
  const pl = createPayload(payload)

  // 既存のデータを検索
  const lastRow = ss.getLastRow()
  const dataRange = ss.getRange(1, 1, lastRow, 3) // A列とB列だけをチェック
  const data = dataRange.getValues()

  // 名前と日付の重複チェック
  let isDuplicate = false
  let maxNo = 0
  data.forEach(function (row) {
    // No列の更新値取得
    if (!isNaN(row[0]) && typeof row[0] === 'number') {
      maxNo = Math.max(maxNo, row[0]) // 最大の番号を更新
    }
    // 名前と日付の重複チェック
    if (row[1] === pl.userName && row[2] === pl.date) {
      isDuplicate = true
    }
  })

  // 重複があれば、処理終了
  if (isDuplicate) {
    return JSON.stringify({
      call: false,
      message: '名前と日付の重複データが存在します'
    })
  }

  // 重複がなければ新しいデータを追加
  if (!isDuplicate) {
    const newRow = [
      maxNo + 1,
      pl.userName,
      pl.date,
      pl.selectedMeetingDay,
      pl.selectedMeetingTime,
      pl.projectName,
      pl.workDetail,
      pl.deferredExistence,
      pl.pointingOut,
      pl.workingStatus,
      pl.communication,
      pl.inTrouble,
      pl.nextProject,
      pl.initiatives,
      pl.opinion,
      pl.createdAt
    ]
    // inputシートに追加
    ss.appendRow(newRow)

    // Notionに貼り付ける用のデータを追加
    addToSpreadsheet(pl)
  }
  return JSON.stringify({
    call: true,
    message: '登録完了しました'
  })
}

function addToSpreadsheet(pl) {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  // A列の最後の値が入っている行を取得
  const lastRow = ss.getLastRow()
  const targetRow = lastRow + 4 // 最後の値の3行後

  // データの登録
  const data = [
    ['お名前', pl.userName],
    ['現場の状況（技術的な部分をメインで）'],
    ['作業内容', pl.projectName],
    ['作業内容（遅延がある場合は、リカバリなどタスク完了に向けた動きを確認）', pl.workDetail],
    ['遅延有無', pl.deferredExistence],
    ['現場からの指摘有無', pl.pointingOut],
    ['稼働状況（稼働が高い場合はその理由等を確認）', pl.workingStatus],
    ['コミュニケーションは問題なく取れているか', pl.comunication],
    ['現場で困っていることなどがあれば', pl.inTrouble],
    ['案件について'],
    ['今後やってみたい案件とその理由', pl.nextProject],
    ['自身で現在取り組んでいること', pl.initiatives],
    ['会社に対する意見・要望', pl.opinion],
    ['その他、何かあれば'],
    ['こちらから連携することがあれば伝える']
  ]

  // データをシートに書き込む
  data.forEach(function (row, index) {
    const currentRow = targetRow + index
    ss.getRange(currentRow, 1).setValue(row[0]) // A列
    if (row.length > 1 && row[1] !== undefined) {
      ss.getRange(currentRow, 2).setValue(row[1]) // B列
    }
  })
}


function getNotionData() {
  const url = `https://api.notion.com/v1/databases/${NOTION_DB}/query`

  const options = {
    method: 'post',
    headers: {
      Authorization: `Bearer ${NOTION_API_TOKEN}`,
      'Notion-Version': '2022-06-28', // Notion API のバージョンを指定
      'Content-Type': 'application/json'
    },
    muteHttpExceptions: true // HTTPエラーの詳細をログに出力する
  }

  try {
    const response = UrlFetchApp.fetch(url, options)
    const data = JSON.parse(response.getContentText())
    Logger.log(data) // レスポンスデータをログに出力
    return data // データを関数から返す
  } catch (e) {
    Logger.log(e.toString()) // エラーをログに出力
    return null // エラーが発生した場合は null を返す
  }
}

// 登録処理
function apiSubmitNotion(payload) {
  // ヒアリング日程登録処理
  const meetingDay = payload.selectedMeetingDay
  const meetingTime = payload.selectedMeetingTime

  payload = JSON.parse(payload)
  const ss = SpreadsheetApp.getActive().getSheetByName('config')
  ss.getRange('A2:A').setValue(payload.count)
  return JSON.stringify({
    call: true,
    message: 'Count has been set!'
  })
}
