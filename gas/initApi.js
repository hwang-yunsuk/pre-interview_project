/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

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
