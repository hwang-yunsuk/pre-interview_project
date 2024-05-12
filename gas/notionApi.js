/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// 現在使わない
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
