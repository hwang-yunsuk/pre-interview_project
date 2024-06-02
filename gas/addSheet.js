/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
function scheduleToSpreadsheet() {
  const spreadsheet = SpreadsheetApp.openById(SHEET_ID)

  // 現在の年月に基づいてシート名を生成
  const sheetName = Utilities.formatDate(NOW.n, 'JST', 'yyyy年MM月')

  // 指定した名前のシートを取得、存在しなければ新しく作成
  var sheet = spreadsheet.getSheetByName(sheetName)
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName)
  } else {
    // シートが存在すると処理終了
    return
  }

  // configシート
  const configSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('config')
  // metting_times列から最後の列まであるデータを取得
  const range = configSheet.getRange('C2:C' + configSheet.getLastRow()).getValues()
  // 二次元配列を一次元配列に変換
  const timeRanges = range.filter((row) => row[0] !== '').map((row) => row[0])

  timeRanges.forEach((timeRange, index) => {
    const timeCell = sheet.getRange(1, 2 + index)
    timeCell.setValue(timeRange)
  })

  const year = NOW.n.getFullYear()
  const month = NOW.n.getMonth()

  // post_dateの値を取得
  const postDate = configSheet.getRange('E2').getValues()[0][0]

  // ヒアリングの基準日を取得
  var baseDate = null
  if (postDate) {
    // post_date設定があれば、+2日後の日付を取得
    baseDate = getTwoDaysLater(year, month, postDate)
  } else {
    // 今月の第1日と月末日を取得
    const firstDayOfMonth = new Date(year, month, 1)

    // 第3月曜日を見つける
    baseDate = findThirdMonday(firstDayOfMonth)
  }
  const lastDayOfMonth = new Date(year, month + 1, 0)

  // ヒアリング日付をA列に設定
  var dateRow = 2
  for (let day = new Date(baseDate); day <= lastDayOfMonth; day.setDate(day.getDate() + 1)) {
    // 週末と月末はスキップ
    if (day.getDay() != 0 && day.getDay() != 6 && day.getDate() !== lastDayOfMonth.getDate()) {
      // 日付をフォーマット
      const formattedDate = formatDate(day)

      // 日付を設定
      const dateCell = sheet.getRange(dateRow, 1)
      dateCell.setValue(formattedDate)

      // 次の行へ
      dateRow++
    }
  }
}

function formatDate(date) {
  const weekDays = ['日', '月', '火', '水', '木', '金', '土']
  const dateString = Utilities.formatDate(date, 'JST', 'yyyy/MM/dd')
  const dayOfWeek = weekDays[date.getDay()]
  return `${dateString} (${dayOfWeek})`
}

function findThirdMonday(date) {
  var count = 0
  var day = new Date(date)
  day.setDate(1) // 月の最初にリセット

  // 第3月曜日を見つけるまでループ
  while (count < 3) {
    if (day.getDay() === 1) {
      // 月曜日の場合
      count++
    }
    if (count < 3) {
      day.setDate(day.getDate() + 1)
    }
  }
  return day
}

function getTwoDaysLater(year, month, postDate) {
  // postDateから日付オブジェクトを作成
  const date = new Date(year, month, postDate)

  // 2日後の日付を計算
  date.setDate(date.getDate() + 2)

  // 結果を yyyy-mm-dd 形式で出力
  return Utilities.formatDate(date, 'JST', 'yyyy-MM-dd')
}
