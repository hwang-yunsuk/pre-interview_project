/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

// 指定されたユーザー名が指定された範囲内のセルにすでに登録されているか確認する関数
function isUserNameRegisteredInRange(userName, dateColumn, timeRow) {
  // SpreadsheetAppを使用してスプレッドシートを取得
  const ws = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME)

  // 指定された範囲内のセルの値を取得
  const range = ws.getRange(1, 1, dateColumn, timeRow)
  const values = range.getValues()

  // 指定された日付と時間に対応するセル内にユーザー名が含まれているか確認
  for (let i = 0; i < dateColumn; i++) {
    for (let j = 0; j < timeRow; j++) {
      // セル内に改行区切りで複数のユーザー名が含まれている場合を考慮して処理を行う
      const cellValue = values[i][j]
      const userNames = cellValue.split('\n')

      // ユーザー名が含まれているか確認
      if (userNames.includes(userName)) {
        // ユーザー名が見つかった場合はtrueを返す
        return true
      }
    }
  }
  // ユーザー名が見つからなかった場合はfalseを返す
  return false
}

// payload作成
function createPayload(payload) {
  const formattedPayload = {
    userName: payload.selectedUser,
    date: Utilities.formatDate(NOW.n, 'JST', 'yyyy/MM/dd'),
    selectedMeetingDay: payload.selectedMeetingDay,
    selectedMeetingTime: payload.selectedMeetingTime,
    projectName: payload.projectName,
    workDetail: payload.workDetail,
    deferredExistence: payload.deferredExistence,
    pointingOut: payload.pointingOut,
    workingStatus: payload.workingStatus,
    communication: payload.communication,
    inTrouble: payload.inTrouble,
    nextProject: payload.nextProject,
    initiatives: payload.initiatives,
    opinion: payload.opinion,
    createdAt: Utilities.formatDate(NOW.n, 'JST', 'yyyy/MM/dd HH:mm:ss')
  }

  // 他の関数で使用する場合は、formattedPayloadを返す
  return formattedPayload
}

// 第2週目の水曜日を検索
function getSecondWednesday() {
  const year = NOW.n.getFullYear()
  const month = NOW.n.getMonth()

  // 当月の1日を取得
  const firstDayOfMonth = new Date(year, month, 1)

  // 1日の曜日を取得（0:日曜, 1:月曜, ..., 6:土曜）
  const weekdayOfFirst = firstDayOfMonth.getDay()

  // 次の水曜日を計算
  const firstWednesday = 10 - weekdayOfFirst + 1

  // 第2週の水曜日は第1週の水曜から7日後
  const secondWednesday = firstWednesday + 7

  return secondWednesday
}
