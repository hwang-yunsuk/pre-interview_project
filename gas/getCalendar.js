/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

// カレンダーデータを取得
function getCalendarDataBySheet() {
  const ss = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)
  const configSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')

  // A列のデータがある最後の行を取得
  const lastRow = ss.getLastRow()
  const lastColumn = ss.getLastColumn()

  // B列から最後の列までのデータ範囲を取得（A列を除外）
  const dataRange = ss.getRange(2, 2, lastRow - 1, lastColumn - 1)
  const data = dataRange.getValues()

  // configシートからユーザー名のリストを取得
  // 'user_names'列の範囲を指定
  const userNamesRange = configSheet.getRange('A2:A' + configSheet.getLastRow())
  const userNames = userNamesRange.getValues().flat() // 2D配列を1D配列に変換
  // mettingDaysリストを取得
  const meetingDays = JSON.parse(apiGetMeetingDays()).data

  let results = []

  // データが存在する場合、特定のデータを取得
  try {
    let NUMBER = 1
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] !== '') {
          // 対象のセルにデータが存在する場合
          const rowNumber = i + 2 // 実際の行番号
          const colNumber = j + 2 // 実際の列番号
          const valueA = ss.getRange(rowNumber, 1).getValue() // A列のデータ
          const isMeetingDatValid = meetingDays.includes(valueA)
          if (isMeetingDatValid) {
            const columnHeader = ss.getRange(1, colNumber).getValue() // 対象列のヘッダー
            const userName = data[i][j] // ユーザー名
            const isUserNameValid = userNames.includes(userName) // ユーザー名がリストに存在するか

            if (isUserNameValid || userName === '不可') {
              results.push({
                No: NUMBER++,
                timeRange: columnHeader,
                date: valueA,
                userName: data[i][j]
              })
            }
          }
        }
      }
    }
  } catch (e) {
    return JSON.stringify({
      call: false,
      message: 'カレンダーAPI取得失敗' + e
    })
  }

  return JSON.stringify({
    data: results,
    call: true,
    message: 'カレンダーAPI取得完了'
  })
}
